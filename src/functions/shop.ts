import db from "../db";
import { Item } from "../models/item";
import { ShopItem } from "../models/shopItem";
import socketServer from "../websocket";

async function switchShop() {
    const date = new Date().getTime();
    const shop = await db<ShopItem>("shop_items")
        .select("date", "item_ids")
        .first();

    if (date >= new Date(shop.date).getTime() + (1000 * 60 * 60 * 24)) {
        const items = await db<Item>("items")
            .select("name_id");

        const currentItems = shop.item_ids.split(",");

        const filtered = items.filter((item) => !currentItems.includes(item.name_id));
        const newItems: string[] = [];

        for (let i = 0; i < 4; i++) {
            const random = Math.floor(Math.random() * filtered.length);
            newItems.push(filtered[random].name_id);
            filtered.splice(random, 1);
        }

        await db("shop_items")
            .update({
                date: new Date().toISOString(),
                item_ids: newItems.join(",")
            });

        socketServer.emit("shop", newItems)

        console.log("[LOG] Switched shop.");
    }
}

export default switchShop;