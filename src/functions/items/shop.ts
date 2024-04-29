import db from "../../db";
import { Item } from "../../models/item";
import { ShopItem } from "../../models/shopItem";
import socketServer from "../../websocket";

async function getRandomItem(rarity: string, items: string[]) {
    const item = await db<Item>("items")
        .select("*")
        .where("rarity", rarity)
        .whereNot("price", 0)
        .whereNotIn("name_id", items)
        .orderByRaw("RANDOM()")
        .first();

    return {
        id: item.id,
        name_id: item.name_id,
        name: item.name,
        image: item.image,
        rarity: item.rarity,
        price: item.price
    };
}

async function switchShop() {
    const date = new Date().getTime();

    const shop = await db<ShopItem>("shop_items")
        .select("date")
        .first();

    if (date >= new Date(shop.date).getTime() + (1000 * 60 * 60 * 24)) {

        await db("shop_items").del();

        const items = [];

        const itemChances = {
            common: 0.4,
            uncommon: 0.8,
            rare: 0.9,
            epic: 0.99,
        };

        for (let i = 0; i < 5; i++) {
            const rarity = Math.random();

            if (rarity <= itemChances.common) {
                const item = await getRandomItem("Common", items.map((item) => item.name_id));
                items.push(item);
            } else if (rarity <= itemChances.uncommon) {
                const item = await getRandomItem("Uncommon", items.map((item) => item.name_id));
                items.push(item);
            } else if (rarity <= itemChances.rare) {
                const item = await getRandomItem("Rare", items.map((item) => item.name_id));
                items.push(item);
            } else if (rarity <= itemChances.epic) {
                const item = await getRandomItem("Epic", items.map((item) => item.name_id));
                items.push(item);
            } else {
                const item = await getRandomItem("Legendary", items.map((item) => item.name_id));
                items.push(item);
            }
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