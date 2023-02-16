const mongoose = require('mongoose');
const env = require('dotenv').config().parsed;
const io = require('../websocket/websocket');

// Connect to the Shop Database

const Shop = mongoose.createConnection(`${env.MONGO_URL}shop?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

// Create the shop model

const shop = Shop.model('items', new mongoose.Schema({
    id: String,
    price: Number,
    rarity: String,
    currentlySelling: Array,
    value: Number
}), 'items');

let today = new Date().getUTCDate();

setInterval(async () => {
    if (new Date().getUTCDate() !== today) {
        // Add new items to the shop

        const items = await shop.find({ price: { $ne: null } }).exec()

        let randomItems = [];

        for (let i = 0; i < 5; i++) {
            let randomItem = items[Math.floor(Math.random() * items.length)];

            randomItems.push(randomItem);

            items.splice(items.indexOf(randomItem), 1);
        }

        // Update the shop
        await shop.findOneAndUpdate({ id: 'selling' }, { $set: { currentlySelling: randomItems } }, { new: true }).exec();

        today = new Date().getUTCDate();

        io.emit('shop', randomItems)
    }
}, 1000 * 60 * 10);

module.exports = shop;