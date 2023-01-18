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
    completed: Boolean
}), 'User');


module.exports = User;