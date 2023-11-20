import db from "../../db";
import { Item } from "../../models/item";
import { ShopItem } from "../../models/shopItem";
import socketServer from "../../websocket";

async function switchShop() {
    const date = new Date().getTime();

    const shop = await db<ShopItem>("shop_items")
        .select("date")
        .first();

    if (date >= new Date(shop.date).getTime() + (1000 * 60 * 60 * 24)) {

        await db("shop_items").del();

        const items = [];
        const possibleItems = await db<Item>("items").select("*");

        for (let i = 0; i < 5; i++) {
            const random = Math.floor(Math.random() * possibleItems.length);
            items.push({
                id: possibleItems[random].id,
                name_id: possibleItems[random].name_id,
                name: possibleItems[random].name,
                image: possibleItems[random].image,
                rarity: possibleItems[random].rarity,
                price: possibleItems[random].price
            });
            possibleItems.splice(random, 1);
        }

        for (const item of items) {
            await db<ShopItem>("shop_items").insert({
                id: item.id,
                name_id: item.name_id,
                name: item.name,
                rarity: item.rarity,
                price: item.price,
                image: item.image,
                date: new Date().toISOString()
            });
        }

        socketServer.emit("shop", items);

        console.log("[LOG] Switched shop.");
    }
}

export default switchShop;