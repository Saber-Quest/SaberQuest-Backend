import mongoose from 'mongoose';
const env = require('dotenv').config().parsed;
import io from '../websocket/websocket';

// Connect to the User Database

// @ts-ignore
const Users = mongoose.createConnection(`${env.MONGO_URL}users?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

// Create the User model

const User = Users.model('User', new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    banner: {
        type: String,
        required: false
    },
    pref: {
        type: String,
        required: true
    },
    r: {
        type: Number,
        required: true
    },
    qp: {
        type: Number,
        required: true
    },
    cp: {
        type: Number,
        required: true
    },
    collectibles: [{
        name: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    value: {
        type: Number,
        required: true
    },
    diff: {
        type: Number,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    },
    discordId: {
        type: String,
        required: true
    },
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


export default User;