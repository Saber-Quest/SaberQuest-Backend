const User = require("../models/user");
const shop = require("../models/shop");
const { DailyChallenge } = require("../models/dailyChallenges");
const io = require("../websocket/websocket");

async function GiveRewards(id, difficulty) {
    let points;
    const user = await User.findOne({ userId: id }).exec();

    // Give the user one to three random collectibles

    // The chance of getting a common collectible is 60%, uncommon is 20%, rare is 10%, epic is 7%, legendary is 3%

    const collectibleChance = ["Common", "Common", "Common", "Common", "Common", "Common", "Uncommon", "Uncommon", "Uncommon", "Uncommon", "Rare", "Rare", "Rare", "Epic", "Epic", "Legendary"];

    const randomAmount = Math.floor(Math.random() * 3) + 1;

    const collectibleRewards = [];

    // Loop through the random amount of collectibles to give

    for (let i = 0; i < randomAmount; i++) {
        // Pick a random rarity

        const collectible = collectibleChance[Math.floor(Math.random() * collectibleChance.length)];

        // Find all items with that rarity

        let reward = await shop.find({ rarity: collectible }).exec();

        reward = reward.filter(item => item.id !== "115" && item.id !== "bcn");

        // Pick a random item from the list of items with that rarity

        const randomCollectible = reward[Math.floor(Math.random() * reward.length)];

        // Add the item to the list of rewards

        collectibleRewards.push(randomCollectible.id);
    }

    // If this is the first completed challenge, give the user a random colored saber

    if (user.cp == 0) {
        const random = Math.random();

        if (random < 0.5) {
            collectibleRewards.push("rs");
        } else {
            collectibleRewards.push("bs");
        }
    }

    // Add the collectibles to the user's collectibles

    let collectibles = user.collectibles;

    for (const collectible of collectibleRewards) {
        const currentCollectibles = collectibles.map(collectible => collectible.name);
        if (currentCollectibles.includes(collectible)) {
            const index = currentCollectibles.indexOf(collectible);
            if (collectible == "rs" || collectible == "bs") collectibles[index].amount += 20;
            else collectibles[index].amount++;
        } else {
            if (collectible == "rs" || collectible == "bs") collectibles.push({
                name: collectible,
                amount: 20,
            });
            else collectibles.push({
                name: collectible,
                amount: 1,
            });
        }
    }

    user.collectibles = collectibles;

    async function GetTotalValue() {
        let totalValue = 0;

        for (const collectible of collectibles) {
            const item = await shop.findOne({ id: collectible.name }).exec();
            totalValue += item.price * collectible.amount;
        }

        return totalValue;
    }

    user.value = await GetTotalValue();

    if (difficulty === "Easy") {

        // Pick a random number between 5 to 10 to give as the points reward

        points = Math.floor(Math.random() * 6) + 5;

        // Set the user's qp to the new amount

        user.qp += points;

        // Update the user

        await user.save();
    }

    if (difficulty === "Normal") {
        points = Math.floor(Math.random() * 6) + 12;

        user.qp += points;

        await user.save();
    }

    if (difficulty === "Hard") {
        points = Math.floor(Math.random() * 6) + 20;

        user.qp += points;

        await user.save();
    }

    if (difficulty === "Extreme") {
        points = Math.floor(Math.random() * 5) + 28;

        user.qp += points;

        await user.save();
    }

    const people = await User.find().exec();

    people.sort((a, b) => b.value - a.value);
    people.forEach((person, index) => {
        person.r = index + 1;
        person.save();
    });

    return {
        collectibles: collectibleRewards,
        points: points,
    };
}

async function BeatLeader(id, difficulty) {
    let completed = false;
    const user = await User.findOne({ userId: id }).exec();
    const today = new Date().getUTCDate();
    const month = new Date().getUTCMonth();
    const year = new Date().getUTCFullYear();
    const currentChallenge = await DailyChallenge.findOne().exec();

    const bl = await fetch(`https://api.beatleader.xyz/player/${id}/scores?sortBy=date&order=desc&page=1&count=50`).then(res => res.json());

    const scores = bl.data;

    const promise = new Promise((resolve, reject) => {
        scores.forEach(async play => {
            if (completed) return;
            if (currentChallenge.source == "score") {
                switch (currentChallenge.type) {
                    case "FCStars":
                        if (play.leaderboard.difficulty.stars >= currentChallenge.difficulties[difficulty].starsBL && play.fullCombo == true) {
                            const dateSet = new Date(play.timepost * 1000).getUTCDate();
                            const monthSet = new Date(play.timepost * 1000).getUTCMonth();
                            const yearSet = new Date(play.timepost * 1000).getUTCFullYear();
                            if (dateSet == today && monthSet == month && yearSet == year) {
                                completed = true;
                                const rewards = await GiveRewards(id, currentChallenge.difficulties[difficulty].name);

                                user.completed = true;
                                user.cp += 1;

                                await user.save();

                                io.emit("challengeCompleted", {
                                    userId: id,
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                })

                                return resolve({
                                    message: 'Challenge completed!',
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                });
                            }
                        }
                        break;
                    case "pp": {
                        if (play.pp >= currentChallenge.difficulties[difficulty].ppBL) {
                            const dateSet = new Date(play.timepost * 1000).getUTCDate();
                            const monthSet = new Date(play.timepost * 1000).getUTCMonth();
                            const yearSet = new Date(play.timepost * 1000).getUTCFullYear();
                            if (dateSet == today && monthSet == month && yearSet == year) {
                                completed = true;
                                const rewards = await GiveRewards(id, currentChallenge.difficulties[difficulty].name);

                                user.completed = true;
                                user.cp += 1;

                                await user.save();

                                io.emit("challengeCompleted", {
                                    userId: id,
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                })

                                return resolve({
                                    message: 'Challenge completed!',
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                });
                            }
                        }
                    }
                        break;
                    case "xAccuracyStars": {
                        const accuracy = play.accuracy * 100;

                        if (accuracy >= currentChallenge.difficulties[difficulty].accuracy && play.leaderboard.difficulty.stars >= currentChallenge.difficulties[difficulty].starsBL) {
                            const dateSet = new Date(play.timepost * 1000).getUTCDate();
                            const monthSet = new Date(play.timepost * 1000).getUTCMonth();
                            const yearSet = new Date(play.timepost * 1000).getUTCFullYear();
                            if (dateSet == today && monthSet == month && yearSet == year) {
                                completed = true;
                                const rewards = await GiveRewards(id, currentChallenge.difficulties[difficulty].name);

                                user.completed = true;
                                user.cp += 1;

                                await user.save();

                                io.emit("challengeCompleted", {
                                    userId: id,
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                })

                                return resolve({
                                    message: 'Challenge completed!',
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                });
                            }
                        }
                    }
                        break;
                    case "xAccuracyPP": {
                        const accuracy = play.accuracy * 100;

                        if (accuracy >= currentChallenge.difficulties[difficulty].accuracy && play.pp >= currentChallenge.difficulties[difficulty].ppBL) {
                            const dateSet = new Date(play.timepost * 1000).getUTCDate();
                            const monthSet = new Date(play.timepost * 1000).getUTCMonth();
                            const yearSet = new Date(play.timepost * 1000).getUTCFullYear();
                            if (dateSet == today && monthSet == month && yearSet == year) {
                                completed = true;
                                const rewards = await GiveRewards(id, currentChallenge.difficulties[difficulty].name);

                                user.completed = true;
                                user.cp += 1;

                                await user.save();

                                io.emit("challengeCompleted", {
                                    userId: id,
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                })

                                return resolve({
                                    message: 'Challenge completed!',
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                });
                            }
                        }
                    }
                        break;
                    case "playXMaps": {
                        const plays = await fetch(`https://api.beatleader.xyz/player/${id}/scores?sortBy=date&order=desc&page=1&count=50`).then(res => res.json());
                        let count = 0;

                        plays.playerScores.forEach(play => {
                            const dateSet = new Date(play.timepost * 1000).getDate();
                            const monthSet = new Date(play.timepost * 1000).getUTCMonth();
                            const yearSet = new Date(play.timepost * 1000).getUTCFullYear();
                            if (dateSet == today && monthSet == month && yearSet == year) count++;
                        });

                        if (count >= currentChallenge.difficulties[difficulty].maps) {
                            completed = true;
                            const rewards = await GiveRewards(id, currentChallenge.difficulties[difficulty].name);

                            user.completed = true;
                            user.cp += 1;

                            await user.save();

                            io.emit("challengeCompleted", {
                                userId: id,
                                difficulty: currentChallenge.difficulties[difficulty].name,
                                rewards: rewards
                            })

                            return resolve({
                                message: 'Challenge completed!',
                                difficulty: currentChallenge.difficulties[difficulty].name,
                                rewards: rewards
                            });
                        }
                    }
                        break;
                }
            }

            else if (currentChallenge.source == "beatsaver") {
                switch (currentChallenge.type) {
                    case "fcNotes": {
                        if (play.fullCombo) {
                            const map = await fetch(`https://api.beatsaver.com/maps/hash/${play.leaderboard.songHash}`).then(res => res.json());

                            const diff = play.leaderboard.difficulty.difficultyName;

                            map.versions[0].diffs.forEach(async d => {
                                if (d.difficulty == diff) {
                                    if (d.notes >= currentChallenge.difficulties[difficulty].notes) {
                                        const dateSet = new Date(play.timepost * 1000).getUTCDate();
                                        const monthSet = new Date(play.timepost * 1000).getUTCMonth();
                                        const yearSet = new Date(play.timepost * 1000).getUTCFullYear();
                                        if (dateSet == today && monthSet == month && yearSet == year) {
                                            completed = true;
                                            const rewards = await GiveRewards(id, currentChallenge.difficulties[difficulty].name);

                                            user.completed = true;
                                            user.cp += 1;

                                            await user.save();

                                            io.emit("challengeCompleted", {
                                                userId: id,
                                                difficulty: currentChallenge.difficulties[difficulty].name,
                                                rewards: rewards
                                            })

                                            return resolve({
                                                message: 'Challenge completed!',
                                                difficulty: currentChallenge.difficulties[difficulty].name,
                                                rewards: rewards
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }
                        break;
                    case "passNotes": {
                        const map = await fetch(`https://api.beatsaver.com/maps/hash/${play.leaderboard.songHash}`).then(res => res.json());

                        const diff = play.leaderboard.difficulty.difficultyName;

                        map.versions[0].diffs.forEach(async d => {
                            if (d.difficulty == diff) {
                                if (d.notes >= currentChallenge.difficulties[difficulty].notes) {
                                    const dateSet = new Date(play.timepost * 1000).getUTCDate();
                                    const monthSet = new Date(play.timepost * 1000).getUTCMonth();
                                    const yearSet = new Date(play.timepost * 1000).getUTCFullYear();
                                    if (dateSet == today && monthSet == month && yearSet == year) {
                                        completed = true;
                                        const rewards = await GiveRewards(id, currentChallenge.difficulties[difficulty].name);

                                        user.completed = true;
                                        user.cp += 1;

                                        await user.save();

                                        io.emit("challengeCompleted", {
                                            userId: id,
                                            difficulty: currentChallenge.difficulties[difficulty].name,
                                            rewards: rewards
                                        })

                                        return resolve({
                                            message: 'Challenge completed!',
                                            difficulty: currentChallenge.difficulties[difficulty].name,
                                            rewards: rewards
                                        });
                                    }
                                }
                            }
                        });
                    }
                        break;
                    case "passLength": {
                        const map = await fetch(`https://api.beatsaver.com/maps/hash/${play.leaderboard.songHash}`).then(res => res.json());

                        if (map.metadata.duration >= currentChallenge.difficulties[difficulty].length) {
                            const dateSet = new Date(play.timepost * 1000).getUTCDate();
                            const monthSet = new Date(play.timepost * 1000).getUTCMonth();
                            const yearSet = new Date(play.timepost * 1000).getUTCFullYear();
                            if (dateSet == today && monthSet == month && yearSet == year) {
                                completed = true;
                                const rewards = await GiveRewards(id, currentChallenge.difficulties[difficulty].name);

                                user.completed = true;
                                user.cp += 1;

                                await user.save();

                                io.emit("challengeCompleted", {
                                    userId: id,
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                })

                                return resolve({
                                    message: 'Challenge completed!',
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                });
                            }
                        }
                    }
                        break;
                }
            }
        });
    });

    return promise;
}

module.exports = BeatLeader;