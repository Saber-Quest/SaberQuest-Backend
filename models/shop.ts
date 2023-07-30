import mongoose from 'mongoose';
const env = require('dotenv').config().parsed;
import io from '../websocket/websocket';
import { Item } from '../types/item';

// Connect to the Shop Database

// @ts-ignore
const Shop = mongoose.createConnection(`${env.MONGO_URL}shop?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

// Create the shop model

const shop = Shop.model('items', new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    rarity: {
        type: String,
        required: false
    },
    currentlySelling: {
        type: Array,
        required: false
    },
    value: {
        type: Number,
        required: true
    }
}), 'items');

let today = new Date().getUTCDate();

setInterval(async () => {
    if (new Date().getUTCDate() !== today) {
        // Add new items to the shop

        // @ts-ignore
        const items: Item[] = await shop.find({ price: { $ne: null } }).exec()

        let randomItems: string[] = [];

        for (let i = 0; i < 5; i++) {
            let randomItem = items[Math.floor(Math.random() * items.length)];

            // @ts-ignore
            randomItems.push(randomItem);

            items.splice(items.indexOf(randomItem), 1);
        }

        // Update the shop
        await shop.findOneAndUpdate({ id: 'selling' }, { $set: { currentlySelling: randomItems } }, { new: true }).exec();

        today = new Date().getUTCDate();

        io.emit('shop', randomItems)
    }
}, 1000 * 60 * 10);

export default shop;