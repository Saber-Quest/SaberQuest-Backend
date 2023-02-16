const mongoose = require('mongoose');
const env = require('dotenv').config().parsed;

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
    oculus: String
}), 'User');

let today = new Date().getUTCDate();

setInterval(async () => {
    if (new Date().getUTCDate() !== today) {
        console.log("Updating users...")
        await User.updateMany({ completed: true }, { $set: { completed: false } }).exec();
        await User.updateMany({ diff: { $ne: 4 } }, { $set: { diff: 4 } }).exec();

        today = new Date().getUTCDate();
    }
}, 1000 * 60);


module.exports = User;