import type { Request, Response } from "express";
import { GET } from "../../router";
import { ShopItem } from "../../models/shopItem";
import db from "../../db";
import { Item } from "../../models/item";
import { cache, setCache } from "../../functions/cache";

export class ShopItems {
    @GET("items/shop", cache)
    async get(req: Request, res: Response) {
        try {
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
                }
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
