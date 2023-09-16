import type { Request, Response } from "express";
import { GET } from "../../router";
import { ShopItem } from "../../models/shopItem";
import db from "../../db";
import { Item } from "../../models/item";
import { cache, setCache } from "../../functions/cache";

export class ShopItems {
    /**
     * GET /items/shop
     * @summary Get items currently in the shop
     * @tags Items
     * @return {object} 200 - Success
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * {
     * "items": [
     * {
     *     "id": "bs",
     *     "name": "Blue Saber",
     *     "image": "https://saberquest.xyz/images/blue_saber_icon.png",
     *     "rarity": "Rare",
     *     "price": 5
     * },
     * {
     *     "id": "bpp",
     *     "name": "Blue Poodle",
     *     "image": "https://saberquest.xyz/images/blue_poodle_icon.png",
     *     "rarity": "Epic",
     *     "price": 5
     * },
     * {
     *     "id": "dn",
     *     "name": "Double Notes",
     *     "image": "https://saberquest.xyz/images/double_notes_icon.png",
     *     "rarity": "Uncommon",
     *     "price": 5
     * },
     * {
     *     "id": "gn",
     *     "name": "Golden Note",
     *     "image": "https://saberquest.xyz/images/golden_note_icon.png",
     *     "rarity": "Legendary",
     *     "price": 5
     * }
     * ],
     * "reset_time": 1694435645081
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @GET("items/shop", cache)
    async get(req: Request, res: Response) {
        try {
            res.setHeader("Access-Control-Allow-Origin", "*");
            setCache(req, "daily");

            const shop = await db<ShopItem>("shop_items")
                .select("*")
                .first();

            const itemArray = shop.item_ids.split(",");
            const itemMap = itemArray.map(async (item) => {
                const itemObject = await db<Item>("items")
                    .select("*")
                    .where("name_id", item)
                    .first();

                return {
                    id: itemObject.name_id,
                    name: itemObject.name,
                    image: itemObject.image,
                    rarity: itemObject.rarity,
                    price: itemObject.price
                };
            });

            const items = await Promise.all(itemMap);

            return res.json({
                items: items,
                reset_time: new Date(shop.date).getTime() + (1000 * 60 * 60 * 24)
            });
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    }
}
