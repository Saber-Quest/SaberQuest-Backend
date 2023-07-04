const mongoose = require('mongoose');
const env = require('dotenv').config().parsed;
const io = require('../websocket/websocket');

const date = new Date();

let currentDb = `${date.getMonth() + 1}${date.getFullYear().toString().slice(2)}`;

let challenges;

let day = date.getUTCDate();

// Connect to the Challenge Database

challenges = mongoose.createConnection(`${env.MONGO_URL}${currentDb}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

const possibleChallenges = mongoose.createConnection(`${env.MONGO_URL}challenges?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

// Create the Challenge model

const Challenge = possibleChallenges.model('challenges', new mongoose.Schema({
    source: String,
    type: String,
    difficulties: Array,
}), 'challenges');

// Create the Daily Challenge model

let DailyChallenge = challenges.model(`${day}`, new mongoose.Schema({
    source: String,
    type: String,
    difficulties: Array,
}), `${day}`);

async function Do() {

    // Add a new challenge to the database if one doesn't exist

    const challenge = await DailyChallenge.findOne().exec();

    if (!challenge) {
        const challenges = await Challenge.find().exec();

        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

        DailyChallenge.create({
            source: randomChallenge.source,
            type: randomChallenge.type,
            difficulties: randomChallenge.difficulties
        });

        setTimeout(() => {
            io.emit('challenge', randomChallenge)
        }, 6000);

        console.log(`Created a new challenge for ${day}`);
    }

    setInterval(async () => {
        if (new Date().getUTCDate() !== day) {
            day = new Date().getUTCDate();

            DailyChallenge = challenges.model(`${day}`, new mongoose.Schema({
                source: String,
                type: String,
                difficulties: Array,
            }), `${day}`);

            const challenges = await Challenge.find().exec();

            const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

            await DailyChallenge.create(randomChallenge);

            console.log(`Created a new challenge for ${new Date().getUTCDate()}/${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`);

            io.emit('challenge', randomChallenge)
        }
    }, 1000 * 60 * 10);

    setInterval(async () => {
        const newDate = new Date();

        if (newDate.getUTCMonth() + 1 !== date.getUTCMonth() + 1) {
            challenges.close();

            currentDb = `${newDate.getMonth() + 1}${newDate.getFullYear().toString().slice(2)}`;

            challenges = mongoose.createConnection(`${env.MONGO_URL}${currentDb}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

            DailyChallenge = challenges.model(`${day}`, new mongoose.Schema({
                source: String,
                type: String,
                difficulties: Array,
            }), `${day}`);

            const challenges = await Challenge.find().exec();

            const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

            await DailyChallenge.create({
                source: randomChallenge.source,
                type: randomChallenge.type,
                difficulties: randomChallenge.difficulties
            });

            console.log(`Created a new challenge for ${day}`);

            io.emit('challenge', randomChallenge)
        }
    }, 1000 * 60 * 30)

}

Do();

module.exports = {
    challenges,
    DailyChallenge
};