const mongoose = require('mongoose');
const env = require("dotenv").config().parsed;

const Shop = mongoose.createConnection(`${env.MONGO_URL}shop?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

// Create the shop model

const shop = Shop.model('items', new mongoose.Schema({
    id: String,
    price: Number,
    rarity: String,
    currentlySelling: Array
}), 'items');

// Connect to the User Database

const Users = mongoose.createConnection(`${env.MONGO_URL}users?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

// Create the User model

const User = Users.model('User', new mongoose.Schema({
    userId: String,
    r: Number,
    qp: Number,
    cp: Number,
    collectibles: [{
        name: String,
        amount: Number,
    }],
    value: Number,
    diff: Number,
    completed: Boolean
}), 'User');

const date = new Date();

let currentDb = `${date.getMonth() + 1}${date.getFullYear().toString().slice(2)}`;

let challenges;

let day = date.getUTCDate();

// Connect to the Challenge Database

challenges = mongoose.createConnection(`${env.MONGO_URL}${currentDb}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

// Create the Daily Challenge model

let DailyChallenge = challenges.model(`${day}`, new mongoose.Schema({
    source: String,
    type: String,
    difficulties: Array,
}), `${day}`);

module.exports = {
    shop: shop,
    User: User,
    DailyChallenge: DailyChallenge
}