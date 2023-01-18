const mongoose = require('mongoose');
const env = require('dotenv').config().parsed;

// Connect to the Shop Database

const Shop = mongoose.createConnection(`${env.MONGO_URL}shop?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

// Create the shop model

const shop = Shop.model('items', new mongoose.Schema({
    id: String,
    price: Number,
    rarity: String,
    currentlySelling: Array
}), 'items');

module.exports = shop;