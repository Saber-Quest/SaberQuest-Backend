const express = require("express")
const router = express.Router();
const shop = require("../../models/shop.js");

router.get("/", async (req, res) => {
    try {
        const items = await shop.findOne({ id: "selling" }).exec();

        res.status(200).json({
            message: 'Current deals fetched successfully!',
            deals: items.currentlySelling.map(item => {
                return {
                    id: item.id,
                    price: item.price,
                    rarity: item.rarity,
                    value: item.value
                }
            }) 
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Fetching items failed!'
        });
    }
});

module.exports = router;