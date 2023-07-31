import mongoose from 'mongoose';
const env = require('dotenv').config().parsed;
import io from '../../websocket/websocket';
import fs from 'fs';

let date = new Date();

let currentDb = `${date.getMonth() + 1}${date.getFullYear().toString().slice(2)}`;

let challenges: any;

let day = date.getUTCDate();

// Connect to the Challenge Database

// @ts-ignore
challenges = mongoose.createConnection(`${env.MONGO_URL}${currentDb}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

// @ts-ignore
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

        fs.writeFileSync('./data/currentChallenge.json', JSON.stringify(randomChallenge, null, 4));

        io.emit('challenge', randomChallenge);

        console.log(`Created a new challenge for ${new Date().getUTCDate()}/${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`);
    }

    setInterval(async () => {
        if (new Date().getUTCDate() !== day) {
            day = new Date().getUTCDate();

            DailyChallenge = challenges.model(`${day}`, new mongoose.Schema({
                source: String,
                type: String,
                difficulties: Array,
            }), `${day}`);

            const challengesObj = await Challenge.find().exec();

            const randomChallenge = challengesObj[Math.floor(Math.random() * challengesObj.length)];

            await DailyChallenge.create({
                source: randomChallenge.source,
                type: randomChallenge.type,
                difficulties: randomChallenge.difficulties
            });

            fs.writeFileSync('./data/currentChallenge.json', JSON.stringify(randomChallenge, null, 4));

            console.log(`Created a new challenge for ${new Date().getUTCDate()}/${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`);

            io.emit('challenge', randomChallenge);
        }
    }, 1000 * 60);

    setInterval(async () => {
        const newDate = new Date();

        if (newDate.getUTCMonth() + 1 !== date.getUTCMonth() + 1) {
            date = newDate;
            challenges.close();

            currentDb = `${newDate.getMonth() + 1}${newDate.getFullYear().toString().slice(2)}`;

            // @ts-ignore
            challenges = mongoose.createConnection(`${env.MONGO_URL}${currentDb}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

            DailyChallenge = challenges.model(`${day}`, new mongoose.Schema({
                source: String,
                type: String,
                difficulties: Array,
            }), `${day}`);

            const challengesObj = await Challenge.find().exec();

            const randomChallenge = challengesObj[Math.floor(Math.random() * challengesObj.length)];

            await DailyChallenge.create({
                source: randomChallenge.source,
                type: randomChallenge.type,
                difficulties: randomChallenge.difficulties
            });

            fs.writeFileSync('./data/currentChallenge.json', JSON.stringify(randomChallenge, null, 4));

            console.log(`Created a new challenge for ${new Date().getUTCDate()}/${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`);

            io.emit('challenge', randomChallenge);
        }
    }, 1000 * 60 * 60)

}

Do();

export { DailyChallenge, Challenge };