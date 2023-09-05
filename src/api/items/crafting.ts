import { PATCH } from "../../router";
import db from "../../db";
import { Request, Response } from "express";
import { verifyJWT } from "../../functions/jwtVerify";
import { Craft } from "../../functions/craft";

export class Crafting {
    /**
     * PATCH /craft
     * @summary Craft an item
     * @tags items
     */
    @PATCH("craft")
    async patch(req: Request, res: Response) {
        const { used1, used2, token } = req.body;

        if (!used1 || !used2 || !token) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const jwt = verifyJWT(token);

        if (jwt.exp < Date.now() / 1000) {
            return res.status(401).json({ error: "Token expired" });
        }

        const user = await db("users")
            .select("id")
            .where("platform_id", jwt.id)
            .first();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userItems = await db("user_items")
            .select("item_id", "amount")
            .where("user_id", user.id)
            .andWhere("amount", ">", 0);

        const itemsArray: string[] = [];

        for (const item of userItems) {
            itemsArray.push(item.item_id);
        }

        const item1 = await db("items")
            .select("id", "name_id")
            .where("name_id", used1)
            .first();

        const item2 = await db("items")
            .select("id", "name_id")
            .where("name_id", used2)
            .first();

        if (!item1 || !item2) {
            return res.status(404).json({ error: "Item not found" });
        }

        if (!itemsArray.includes(item1.id) || !itemsArray.includes(item2.id)) {
            return res.status(404).json({ error: "Item not found" });
        }

        const crafted = Craft(item1.name_id, item2.name_id);

        if (!crafted) {
            return res.status(400).json({ error: "Invalid items" });
        }

        const craftedItem = await db("items")
            .select("id")
            .where("name_id", crafted)
            .first();

        if (!craftedItem) {
            return res.status(404).json({ error: "Item not found" });
        }

        const userCraftedItem = await db("user_items")
            .select("amount")
            .where("user_id", user.id)
            .andWhere("item_id", craftedItem.id)
            .first();

        if (userCraftedItem) {
            await db("user_items")
                .where("user_id", user.id)
                .andWhere("item_id", craftedItem.id)
                .increment("amount", 1);
        } else {
            await db("user_items").insert({
                user_id: user.id,
                item_id: craftedItem.id,
                amount: 1,
            });
        }

        await db("user_items")
            .where("user_id", user.id)
            .andWhere("item_id", item1.id)
            .decrement("amount", 1);

        await db("user_items")
            .where("user_id", user.id)
            .andWhere("item_id", item2.id)
            .decrement("amount", 1);

        return res.status(200).json({ message: "Success" });
    }
}
