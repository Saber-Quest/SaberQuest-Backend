import { Router } from "express";
const router = Router();
import shop from "../../models/shop";
import { Item } from "../../types/item";

router.get("/", async (req, res) => {
    try {
        const items = await shop.findOne({ id: "selling" }).exec();

        res.status(200).json({
            message: 'Current deals fetched successfully!',
            deals: items!.currentlySelling.map((item: Item) => {
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

export default router;