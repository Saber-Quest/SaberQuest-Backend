const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const favicon = require('serve-favicon');

// Connect to the User Database

const Users = mongoose.createConnection("mongodb+srv://a/users?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

// Create the User model

const User = Users.model('User', new mongoose.Schema({
    userId: String,
    r: Number,
    qp: Number,
    cp: Number,
    collectibles: Array,
}), 'User');

// Make a new date to connect to the right challenge database

const date = new Date();

let currentDb = `${date.getMonth() + 1}${date.getFullYear().toString().slice(2)}`;

let challenges;

let day = date.getUTCDate();

// Connect to the Challenge Database

challenges = mongoose.createConnection(`mongodb+srv://b/${currentDb}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

// Create the Daily Challenge model

let DailyChallenge = challenges.model(`${day}`, new mongoose.Schema({
    id: String,
    challenge: String,
}), `${day}`);


// Check every minute if the database or model needs to be changed

setTimeout(() => {
    const newDate = new Date();

    if (newDate.getMonth() + 1 !== date.getMonth() + 1) {
        challenges.close();
        currentDb = `${newDate.getMonth() + 1}${newDate.getFullYear().toString().slice(2)}`;
        challenges = mongoose.createConnection(`mongodb+srv://b/${currentDb}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    if (newDate.getUTCDate() !== day) {
        day = newDate.getUTCDate();
        DailyChallenge = challenges.model(`${day}`, new mongoose.Schema({
            id: String,
            challenge: String,
        }), `${day}`);
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
    res.sendFile(path.join(__dirname, 'public', 'html', 'profile.html'));
});

app.get("/profile/:id", async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'profile.html')), { title: user.name, };
});

// Send the daily challenges to the client

app.get("/api/dailyChallenges", async (req, res) => {
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

// Send the requested user data to the client

app.get("/api/user", async (req, res) => {

    const userId = req.query.userId;

    try {
        const user = await User.findOne({ userId: userId }).exec();

        delete mongoose.connection.models['User'];

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

// Add a new user to the database

app.put("/api/addUser", async (req, res) => {
    const userId = req.query.userId;

    try {
        const user = {
            userId: userId,
            r: 0,
            qp: 0,
            collectibles: []
        }

        const newUser = new User(user);

        await newUser.save();

        res.status(200).json({
            message: 'User updated successfully!',
            user: user.userId,
            collectibles: user.collectibles
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Adding user failed!'
        });
    }
});

// Update the user's collectibles

app.patch("/api/update", async (req, res) => {
    const userId = req.query.userId;
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
                    item.amount--;
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
    const userId = req.query.userId;
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

// Listen on port 3000

app.listen(3000, () => {
    console.log("Server started on port 3000");
});