const checkedUsers = [];
const { User, shop, DailyChallenge } = require("./models.js");

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

    // Add the collectibles to the user's collectibles

    let collectibles = user.collectibles;

    for (const collectible of collectibleRewards) {
        const currentCollectibles = collectibles.map(collectible => collectible.name);
        if (currentCollectibles.includes(collectible)) {
            const index = currentCollectibles.indexOf(collectible);
            if (collectible == "rs" || collectible == "bs") return collectibles[index].amount += 20;
            collectibles[index].amount++;
        } else {
            if (collectible == "rs" || collectible == "bs") return collectibles.push({
                name: collectible,
                amount: 20,
            });
            collectibles.push({
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

module.exports = {
    CheckCompletion : async (userId) => {
        if (checkedUsers.includes(userId)) return true;
    
        checkedUsers.push(userId);
    
        setTimeout(() => {
            checkedUsers.splice(checkedUsers.indexOf(userId), 1);
        }, 1000 * 60 * 30);
    
        let completed = false;
        const user = await User.findOne({ userId: userId }).exec()
        if (user.completed == true) return null;
        const difficulty = user.diff;
        const currentChallenge = await DailyChallenge.findOne().exec();
    
        const ss = await fetch(`https://scoresaber.com/api/player/${userId}/scores`).then(res => res.json())
    
        const promise = new Promise((resolve, reject) => {
    
            ss.playerScores.forEach(async play => {
                if (completed) return;
                if (currentChallenge.source == "scoresaber") {
                    switch (currentChallenge.type) {
                        case "FCStars":
                            if (play.leaderboard.stars > currentChallenge.difficulties[difficulty].stars) {
                                completed = true;
                                const rewards = await GiveRewards(userId, currentChallenge.difficulties[difficulty].name);
    
                                return resolve({
                                    message: 'Challenge completed!',
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                });
                            }
                            break;
                        case "pp": {
                            if (play.score.pp > currentChallenge.difficulties[difficulty].pp) {
                                completed = true;
                                const rewards = await GiveRewards(userId, currentChallenge.difficulties[difficulty].name);
    
                                return resolve({
                                    message: 'Challenge completed!',
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                });
                            }
                        }
                        case "xAccuracyStars": {
                            const accuracy = play.score.baseScore / play.leaderboard.maxScore * 100;
    
                            if (accuracy > currentChallenge.difficulties[difficulty].accuracy && play.leaderboard.stars > currentChallenge.difficulties[difficulty].stars) {
                                completed = true;
                                const rewards = await GiveRewards(userId, currentChallenge.difficulties[difficulty].name);
    
                                return resolve({
                                    message: 'Challenge completed!',
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                });
                            }
                        }
                            break;
                        case "xAccuracyPP": {
                            const accuracy = play.score.baseScore / play.leaderboard.maxScore * 100;
    
                            if (accuracy > currentChallenge.difficulties[difficulty].accuracy && play.score.pp > currentChallenge.difficulties[difficulty].pp) {
                                completed = true;
                                const rewards = await GiveRewards(userId, currentChallenge.difficulties[difficulty].name);
    
                                return resolve({
                                    message: 'Challenge completed!',
                                    difficulty: currentChallenge.difficulties[difficulty].name,
                                    rewards: rewards
                                });
                            }
                        }
                            break;
                        case "playXMaps": {
                            const plays = await fetch(`https://scoresaber.com/api/player/${userId}/scores/recent`).then(res => res.json());
                            const today = new Date().getDate();
                            let count = 0;
    
                            plays.playerScores.forEach(play => {
                                if (play.score.timeSet.split("T")[0].split("-")[2] == today) {
                                    count++;
                                }
                            });
    
                            if (count >= currentChallenge.difficulties[difficulty].maps) {
                                completed = true;
                                const rewards = await GiveRewards(userId, currentChallenge.difficulties[difficulty].name);
    
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
                            if (play.score.fullCombo) {
                                const map = await fetch(`https://api.beatsaver.com/maps/hash/${play.leaderboard.songHash}`).then(res => res.json());
    
                                const diff = play.leaderboard.difficulty.difficultyRaw.split("_")[1];
    
                                map.versions[0].diffs.forEach(async d => {
                                    if (d.difficulty == diff) {
                                        if (d.notes > currentChallenge.difficulties[difficulty].notes) {
                                            completed = true;
                                            const rewards = await GiveRewards(userId, currentChallenge.difficulties[difficulty].name);
    
                                            return resolve({
                                                message: 'Challenge completed!',
                                                difficulty: currentChallenge.difficulties[difficulty].name,
                                                rewards: rewards
                                            });
                                        }
                                    }
                                });
                            }
                        }
                            break;
                        case "passNotes": {
                            const map = await fetch(`https://api.beatsaver.com/maps/hash/${play.leaderboard.songHash}`).then(res => res.json());
    
                            const diff = play.leaderboard.difficulty.difficultyRaw.split("_")[1];
    
                            map.versions[0].diffs.forEach(async d => {
                                if (d.difficulty == diff) {
                                    if (d.notes > currentChallenge.difficulties[difficulty].notes) {
                                        completed = true;
                                        const rewards = await GiveRewards(userId, currentChallenge.difficulties[difficulty].name);
    
                                        return resolve({
                                            message: 'Challenge completed!',
                                            difficulty: currentChallenge.difficulties[difficulty].name,
                                            rewards: rewards
                                        });
                                    }
                                }
                            });
                        }
                            break;
                        case "passLength": {
                            const diff = play.leaderboard.difficulty.difficultyRaw.split("_")[1];
    
                            if (diff != "ExpertPlus") return;
    
                            const map = await fetch(`https://api.beatsaver.com/maps/hash/${play.leaderboard.songHash}`).then(res => res.json());
    
                            if (map.metadata.duration > currentChallenge.difficulties[difficulty].length) {
                                completed = true;
                                const rewards = await GiveRewards(userId, currentChallenge.difficulties[difficulty].name);
    
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
            });
        });
    
        return promise;
    }
}