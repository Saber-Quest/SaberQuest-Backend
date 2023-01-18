const mongoose = require('mongoose');
const env = require('dotenv').config().parsed;

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

module.exports = DailyChallenge;