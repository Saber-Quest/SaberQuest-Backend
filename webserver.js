const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const favicon = require('serve-favicon');
const { encrypt, decrypt } = require("./functions/encryption.js");
const { CheckCompletion } = require("./functions/rewards.js")
const { shop, User, DailyChallenge } = require("./functions/models.js")
const fs = require('fs');
const env = require('dotenv').config().parsed;

// Make a new date to connect to the right challenge database

async function Get() {

    const items = await shop.find().exec();
    const inShop = await shop.findOne({ id: "selling" }).exec();

    const currentlySelling = inShop.currentlySelling.map(item => item.id);

    let selling = [];
    let loops = 0;

    function MakeSale() {
        let item = items[Math.floor(Math.random() * items.length)];

        if (item.price == null) return;

        if (item.id !== "selling") {
            if (currentlySelling.includes(item.id)) return MakeSale();
            selling.push({
                id: item.id,
                price: item.price,
                rarity: item.rarity,
            });
            items.splice(items.indexOf(item), 1);
            loops++;
        }
    }

    while (loops < 5) {
        MakeSale();
    }

    inShop.currentlySelling = selling;

    inShop.save();
}

Get();

const date = new Date();

let currentDb = `${date.getMonth() + 1}${date.getFullYear().toString().slice(2)}`;

let challenges;

let day = date.getUTCDate();

// Check every hour if the database needs to be changed

setInterval(async () => {
    const newDate = new Date();

    if (newDate.getMonth() + 1 !== date.getMonth() + 1) {
        challenges.close();
        currentDb = `${newDate.getMonth() + 1}${newDate.getFullYear().toString().slice(2)}`;
        challenges = mongoose.createConnection(`${env.MONGO_URL}${currentDb}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    if (newDate.getUTCDate() !== day) {
        day = newDate.getUTCDate();
        DailyChallenge = challenges.model(`${day}`, new mongoose.Schema({
            id: String,
            challenge: String,
        }), `${day}`);

        day = newDate.getUTCDate();

        const items = await shop.find().exec();
        const inShop = await shop.find({ id: "selling" }).exec();

        let selling = [];
        let inNewShop = [];
        let loops = 0;
        function MakeSale() {
            let item = items[Math.floor(Math.random() * items.length)];

            if (item.price == null) return;

            if (item.id !== "selling") {
                if (inShop[0].currentlySelling.includes(item.id)) return MakeSale();
                selling.push({
                    id: item.id,
                    price: item.price,
                    rarity: item.rarity,
                });
                inNewShop.push(item.id);
                items.splice(items.indexOf(item), 1);
                loops++;
            }
        }

        while (loops < 5) {
            MakeSale();
        }
    }
}, 1000 * 60);

const app = express();

// Serve the static files, and favicon

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get("/inventory", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'inventory.html'));
});

app.get("/profile", (req, res) => {
    let file = String(fs.readFileSync(path.join(__dirname, 'public', 'html', 'profile.html')));

    file = file.replace("{{user}}", "Login")

    res.send(file);
});

app.get("/profile/:id", async (req, res) => {
    let file = String(fs.readFileSync(path.join(__dirname, 'public', 'html', 'profile.html')));

    const ssUser = await fetch(`https://scoresaber.com/api/player/${req.params.id}/basic`).then(res => res.json());

    const user = await User.findOne({ userId: req.params.id }).exec();

    const amountOfCollectibles = user.collectibles.map(collectible => collectible.amount).reduce((a, b) => a + b, 0);

    if (ssUser.errorMessage) return res.redirect("/profile");

    file = file.replace(/{{user}}/g, ssUser.name).replace("{{description}}", `Player Rank: #${user.r}\nAccount Value: ${user.value}\nChallenges Completed: ${user.cp}\nQuest Points: ${user.qp}\nNumber of Collectibles: ${amountOfCollectibles}`).replace("{{avatar}}", ssUser.profilePicture)

    res.send(file);
});

app.get("/leaderboards/:id", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'leaderboard.html'));
});

app.get("/shop", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'shop.html'));
});

app.get("/shop/gamble", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'gambling.html'));
});

app.get("/would-be-kinda-funny-if-someone-finds-this-url-by-accident", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'admin.html'));
});

// Send the daily challenges to the client

app.get("/api/daily-challenges", async (req, res) => {
    try {
        const dailyChallenges = await DailyChallenge.find().exec();

        const json = {};

        for (const dailyChallenge of dailyChallenges) {
            json[dailyChallenge.id.toLowerCase()] = dailyChallenge;
        }

        res.status(200).json({
            message: 'Daily Challenges fetched successfully!',
            dailyChallenges: json
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Fetching daily challenges failed!'
        });
    }
});

app.get("/api/top-players", async (req, res) => {
    const page = req.query.page;
    try {
        const topPlayers = await User.find().sort({ value: -1 }).select("userId value cp");

        topPlayers.splice(0, (page - 1) * 10);

        res.status(200).json({
            message: 'Top players fetched successfully!',
            topPlayers: topPlayers
        });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Fetching top players failed!'
        });
    }
});

// Send the requested user data to the client

app.get("/api/user", async (req, res) => {
    let userId;

    if (req.headers.type == "auth") userId = decrypt(req.headers.user);
    else if (req.headers.type == "no-auth") userId = req.query.userId;

    try {
        const user = await User.findOne({ userId: userId }).exec();

        res.status(200).json({
            message: 'User fetched successfully!',
            user: user.userId,
            rank: user.r,
            qp: user.qp,
            challengesCompleted: user.cp,
            collectibles: user.collectibles
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Fetching user failed!'
        });
    }
});

// Update the user's collectibles

app.patch("/api/update", async (req, res) => {
    const userId = decrypt(req.headers.user);
    const collectible1 = req.query.item1;
    const collectible2 = req.query.item2;
    const type = req.query.type;

    try {
        const user = await User.findOne({ userId: userId }).exec();

        for (const item of user.collectibles) {
            if (item.name === collectible1 || item.name === collectible2) {
                if (type === 'add') {
                    item.amount++;
                } else if (type === 'remove') {
                    if (collectible1 == collectible2) {
                        item.amount -= 2;
                    }
                    else {
                        item.amount--;
                    }
                }
            }
        }

        await User.updateOne({ userId: userId }, { collectibles: user.collectibles });

        res.status(200).json({
            message: 'User updated successfully!',
            user: user.userId,
            collectibles: user.collectibles
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Connecting to database failed!'
        });
    }
});

// Add a new collectible to the user's inventory

app.put("/api/addCollectible", async (req, res) => {
    const userId = decrypt(req.headers.user);
    const collectible = req.query.item;

    try {
        const user = await User.findOne({ userId: userId }).exec();

        user.collectibles.push({ name: collectible, amount: 1 });

        await User.updateOne({ userId: userId }, { collectibles: user.collectibles });

        res.status(200).json({
            message: 'User updated successfully!',
            user: user.userId,
            collectibles: user.collectibles
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Connecting to database failed!'
        });
    }
});

app.get("/api/current-deals", async (req, res) => {
    try {
        const items = await shop.find({ id: "selling" }).exec();

        res.status(200).json({
            message: 'Current deals fetched successfully!',
            deals: items[0].currentlySelling
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Fetching items failed!'
        });
    }
});

app.post("/api/validate", async (req, res) => {
    const decrypted = decrypt(req.headers.user);
    const userId = req.query.pageId;

    if (decrypted == userId) {
        const cd = await CheckCompletion(userId);

        if (cd == true) {
            res.status(200).json({
                success: false,
                message: "This profile has already been updated within an hour."
            });
        }

        else if (cd == null) {
            res.status(200).json({
                success: false,
                message: "This profile already completed the daily challenge."
            });
        }

        else {
            res.status(200).json({
                success: true,
                message: cd.message,
                difficulty: cd.difficulty,
                rewards: cd.rewards
            });
        }

    }

    else {
        res.status(401).json({
            success: false,
            message: "You are not allowed to do this."
        });
    }
});

app.post("/api/encrypt/:reason", async (req, res) => {
    const { reason } = req.params;
    const { data } = req.query;

    const encrypted = encrypt(data);

    switch (reason) {
        case "userId": {
            const allowed_users = ["366210991735701505", "482507481663275009"];

            if (allowed_users.includes(data)) {
                res.status(200).json({
                    message: "User is allowed to use the API",
                    encrypted: encrypted
                });
            }

            else {
                res.status(401).json({
                    message: "error",
                    message: "User is not allowed to use the API"
                });
            }
        }
    }
});

app.post("/api/decrypt/:reason", async (req, res) => {
    const { reason } = req.params;
    const data = req.headers.user;

    const decrypted = decrypt(data);

    switch (reason) {
        case "userId": {
            const allowed_users = ["366210991735701505", "482507481663275009"];

            if (allowed_users.includes(decrypted)) {
                res.status(200).json({
                    message: "User is allowed to use the API"
                });
            }

            else {
                res.status(401).json({
                    message: "error",
                });
            }
        }
            break;
        case "userLogin": {
            const user = await User.findOne({ userId: decrypted }).exec();

            console.log(user);

            if (user == null) {
                const newUser = new User({
                    userId: decrypted,
                    qp: 0,
                    r: 0,
                    cp: 0,
                    value: 0,
                    collectibles: []
                });

                await newUser.save();
            }

            res.status(200).json({
                decryptedToken: decrypted
            });
        }
    }
});

app.get("/api/steam-login", async (req, res) => {
    const id = req.query['openid.identity'].split("/")[5];

    const encrypted = encrypt(id);

    res.redirect(`http://localhost:3000/profile#${encrypted}`);
});

app.post("/api/gamble", async (req, res) => {
    const userId = decrypt(req.headers.user);
    const user = await User.findOne({ userId: userId }).exec();

    if (user.qp < 20) return res.status(400).json({ success: false, error: "You don't have enough QP to gamble" });

    // Choose a random rarity
    // The chance of getting common is 50%, uncommon is 30%, rare is 15%, epic is 4%, legendary is 1%

    user.qp -= 20;

    const rarity = Math.floor(Math.random() * 100);

    let chosenRarity;

    if (rarity < 50) chosenRarity = "Common";
    else if (rarity < 80) chosenRarity = "Uncommon";
    else if (rarity < 95) chosenRarity = "Rare";
    else if (rarity < 99) chosenRarity = "Epic";
    else chosenRarity = "Legendary";

    // Choose a random item from the chosen rarity

    const items = await shop.find({ rarity: chosenRarity }).exec();

    const chosenItem = items[Math.floor(Math.random() * items.length)];

    const collectible = chosenItem.id;

    // Give the user the item
    let collectibles = user.collectibles;

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

    user.collectibles = collectibles;

    await user.save();

    console.log(user.qp)

    res.status(200).json({
        success: true,
        itemWon: chosenItem.id,
        rarity: chosenItem.rarity
    });
});

app.post("/api/mod-submit", async (req, res) => {
    const cd = CheckCompletion(decrypt(req.headers.user));

    if (cd) {
        res.status(200).json({
            success: false,
            message: "This profile has already been updated within an hour."
        });
    }

    else {
        res.status(200).json({
            success: true,
            message: cd.message,
            type: cd.type,
            rewards: cd.rewards
        });
    }
});

// Listen on port 3000

app.listen(3000, () => {
    console.log("Server started on port 3000");
});