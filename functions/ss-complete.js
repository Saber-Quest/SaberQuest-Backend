const User = require('../models/user');
const shop = require("../models/shop.js");
const { DailyChallenge } = require('../models/dailyChallenges');
const io = require('../websocket/websocket');

async function GiveRewards(id, difficulty) {
    let points;
    const user = await User.findOne({ userId: id }).exec();

    // Give the user one to three random collectibles

    // Funny array of rarities
    const collectibleChance = ["Common", "Common", "Uncommon", "Common", "Common", "Common", "Common", "Common", "Common", "Rare", "Common",
        "Uncommon", "Uncommon", "Common", "Rare", "Common", "Common", "Uncommon", "Common", "Legendary", "Common", "Common", "Uncommon",
        "Common", "Common", "Uncommon", "Common", "Common", "Common", "Common", "Common", "Common", "Rare", "Uncommon", "Common", "Common",
        "Common", "Rare", "Common", "Common", "Common"]

    const randomAmount = Math.floor(Math.random() * 3) + 1;

    const collectibleRewards = [];

    // Loop through the random amount of collectibles to give

    for (let i = 0; i < randomAmount; i++) {
        // Pick a random rarity

        const collectible = collectibleChance[Math.floor(Math.random() * collectibleChance.length)];

        // Find all items with that rarity

        let reward = await shop.find({ rarity: collectible }).exec();

        reward = reward.filter(item => item.id !== "115" && item.id !== "bcn" && item.id !== "gn" && item.id !== "sn");

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
            totalValue += item.value * collectible.amount;
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

async function ScoreSaber(id, difficulty) {
    let completed = false;
    const user = await User.findOne({ userId: id }).exec();
    const today = new Date().getUTCDate();
    const month = new Date().getUTCMonth();
    const year = new Date().getUTCFullYear();
    const currentChallenge = await DailyChallenge.findOne().exec();

    const ss = await fetch(`https://scoresaber.com/api/player/${id}/scores?limit=50&sort=recent`).then(res => res.json())

    if (currentChallenge.type == "playXMaps") {
        const today = new Date().getDate();
        const month = new Date().getMonth();
        const year = new Date().getFullYear();
        let count = 0;

        ss.playerScores.forEach(play => {
            const dateSet = new Date(play.score.timeSet).getDate();
            const monthSet = new Date(play.score.timeSet).getMonth();
            const yearSet = new Date(play.score.timeSet).getFullYear();
            if (dateSet == today && monthSet == month && yearSet == year) count++;
        });

        if (count >= currentChallenge.difficulties[difficulty].maps) {
            if (completed) return;
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

            return {
                message: 'Challenge completed!',
                difficulty: currentChallenge.difficulties[difficulty].name,
                rewards: rewards
            };
        }

        else {
            return "not-completed"
        }
    }

    else {
        const promise = new Promise(async (resolve, reject) => {
            for (const play of ss.playerScores) {
                if (completed) return;
                if (currentChallenge.source == "score") {
                    switch (currentChallenge.type) {
                        case "FCStars":
                            if (play.leaderboard.stars >= currentChallenge.difficulties[difficulty].starsSS && play.score.fullCombo == true) {
                                if (completed) return;
                                const dateSet = new Date(play.score.timeSet).getUTCDate();
                                const monthSet = new Date(play.score.timeSet).getUTCMonth();
                                const yearSet = new Date(play.score.timeSet).getUTCFullYear();
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
                            if (play.score.pp >= currentChallenge.difficulties[difficulty].ppSS) {
                                if (completed) return;
                                const dateSet = new Date(play.score.timeSet).getUTCDate();
                                const monthSet = new Date(play.score.timeSet).getUTCMonth();
                                const yearSet = new Date(play.score.timeSet).getUTCFullYear();
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
                        }
                        case "xAccuracyStars": {
                            const accuracy = play.score.baseScore / play.leaderboard.maxScore * 100;
                            console.log(accuracy, currentChallenge.difficulties[difficulty].accuracy, play.leaderboard.stars, currentChallenge.difficulties[difficulty].starsSS)
                            if (accuracy >= currentChallenge.difficulties[difficulty].accuracy && play.leaderboard.stars >= currentChallenge.difficulties[difficulty].starsSS) {
                                if (completed) return;
                                const dateSet = new Date(play.score.timeSet).getUTCDate();
                                const monthSet = new Date(play.score.timeSet).getUTCMonth();
                                const yearSet = new Date(play.score.timeSet).getUTCFullYear();
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
                            const accuracy = play.score.baseScore / play.leaderboard.maxScore * 100;

                            if (accuracy >= currentChallenge.difficulties[difficulty].accuracy && play.score.pp >= currentChallenge.difficulties[difficulty].ppSS) {
                                if (completed) return;
                                const dateSet = new Date(play.score.timeSet).getUTCDate();
                                const monthSet = new Date(play.score.timeSet).getUTCMonth();
                                const yearSet = new Date(play.score.timeSet).getUTCFullYear();
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

                else if (currentChallenge.source == "beatsaver") {
                    switch (currentChallenge.type) {
                        case "fcNotes": {
                            if (play.score.fullCombo) {
                                await new Promise(resolve => setTimeout(resolve, 10));
                                const map = await fetch(`https://api.beatsaver.com/maps/hash/${play.leaderboard.songHash}`).then(res => res.json());

                                const diff = play.leaderboard.difficulty.difficultyRaw.split("_")[1];

                                map.versions[0].diffs.forEach(async d => {
                                    if (d.difficulty == diff) {
                                        if (d.notes >= currentChallenge.difficulties[difficulty].notes) {
                                            if (completed) return;
                                            const dateSet = new Date(play.score.timeSet).getUTCDate();
                                            const monthSet = new Date(play.score.timeSet).getUTCMonth();
                                            const yearSet = new Date(play.score.timeSet).getUTCFullYear();
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
                            await new Promise(resolve => setTimeout(resolve, 10));
                            const map = await fetch(`https://api.beatsaver.com/maps/hash/${play.leaderboard.songHash}`).then(res => res.json());

                            const diff = play.leaderboard.difficulty.difficultyRaw.split("_")[1];

                            map.versions[0].diffs.forEach(async d => {
                                console.log(d.difficulty, diff, d.notes, currentChallenge.difficulties[difficulty].notes)
                                if (d.difficulty == diff) {
                                    if (d.notes >= currentChallenge.difficulties[difficulty].notes) {
                                        if (completed) return;
                                        const dateSet = new Date(play.score.timeSet).getUTCDate();
                                        const monthSet = new Date(play.score.timeSet).getUTCMonth();
                                        const yearSet = new Date(play.score.timeSet).getUTCFullYear();
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
                            await new Promise(resolve => setTimeout(resolve, 10));
                            const map = await fetch(`https://api.beatsaver.com/maps/hash/${play.leaderboard.songHash}`).then(res => res.json());

                            if (map.metadata.duration >= currentChallenge.difficulties[difficulty].length) {
                                if (completed) return;
                                const dateSet = new Date(play.score.timeSet).getUTCDate();
                                const monthSet = new Date(play.score.timeSet).getUTCMonth();
                                const yearSet = new Date(play.score.timeSet).getUTCFullYear();
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

                if (play == ss.playerScores[ss.playerScores.length - 1]) {
                    return resolve("not-completed")
                }
            }
        });
        return promise
    }
}

module.exports = ScoreSaber;