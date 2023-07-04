const mongoose = require('mongoose');
const env = require('dotenv').config().parsed;
const io = require('../websocket/websocket');

// Connect to the User Database

const Users = mongoose.createConnection(`${env.MONGO_URL}users?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

// Create the User model

const User = Users.model('User', new mongoose.Schema({
    userId: String,
    pref: String,
    r: Number,
    qp: Number,
    cp: Number,
    collectibles: [{
        name: String,
        amount: Number,
    }],
    value: Number,
    diff: Number,
    completed: Boolean,
    discordId: String,
}), 'User');

let today = new Date().getUTCDate();

setInterval(async () => {
    const newDate = new Date().getUTCDate();
    if (newDate !== today) {
        console.log("[DEBUG] Updating users...");
        await User.updateMany({ completed: true }, { $set: { completed: false } }).exec();
        await User.updateMany({ diff: { $ne: 4 } }, { $set: { diff: 4 } }).exec();

        today = newDate;
    }
}, 1000 * 60);


module.exports = User;