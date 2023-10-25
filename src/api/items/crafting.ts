import { GET, POST } from "../../router";
import db from "../../db";
import { Request, Response } from "express";
import { verifyJWT } from "../../functions/users/jwtVerify";
import { Craft } from "../../functions/items/craft";
import { clearUserCache } from "../../functions/cache";
import { User } from "../../models/user";
import socketServer from "../../websocket";
import { Item } from "../../models/item";
import setRanks from "../../functions/users/ranks";

export class Crafting {
    /**
     * Crafting
     * @typedef {object} Crafting
     * @property {string} used1.required - The first item used to craft
     * @property {string} used2.required - The second item used to craft
     * @property {string} token.required - The user's JWT token
     */

    /**
     * POST /craft
     * @summary Craft an item
     * @tags Items
     * @security JWT
     * @param {Crafting} request.body.required - The item to craft
     * @return {object} 200 - Success
     * @return {object} 400 - Missing fields
     * @return {object} 400 - Invalid items
     * @return {object} 404 - Item not found
     * @return {object} 404 - User not found
     * @return {object} 401 - Token expired
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * {
     * "message": "Success"
     * }
     * @example response - 400 - Missing fields
     * {
     * "error": "Missing fields"
     * }
     * @example response - 400 - Invalid items
     * {
     * "error": "Invalid items"
     * }
     * @example response - 404 - Item not found
     * {
     * "error": "Item not found"
     * }
     *  @example response - 404 - User not found
     * {
     * "error": "User not found"
     * }
     * @example response - 401 - Token expired
     * {
     * "error": "Token expired"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @POST("craft")
    async post(req: Request, res: Response) {
        try {
            const { used1, used2, token } = req.body;

            if (!used1 || !used2 || !token) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const jwt = verifyJWT(token);

            if (!jwt || jwt.exp < Date.now() / 1000) {
                return res.status(401).json({ error: "Token expired" });
            }

            const user = await db<User>("users")
                .select("id", "platform_id")
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

            const item1 = await db<Item>("items")
                .select("id", "name_id", "value", "image")
                .where("name_id", used1)
                .first();

            const item2 = await db<Item>("items")
                .select("id", "name_id", "value", "image")
                .where("name_id", used2)
                .first();

            if (!item1 || !item2) {
                return res.status(404).json({ error: "Item not found" });
            }

            if (!itemsArray.includes(item1.id) || !itemsArray.includes(item2.id)) {
                return res.status(404).json({ error: "Item not found" });
            }

            const crafted = await Craft(item1.name_id, item2.name_id);

            if (crafted === "") {
                return res.status(400).json({ error: "Invalid items" });
            }

            const craftedItem = await db<Item>("items")
                .select("id", "value", "image", "name_id")
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

            const lostValue = item1.value + item2.value;
            const gainedValue = craftedItem.value;

            const valueDifference = gainedValue - lostValue;

            await db("users")
                .where("id", user.id)
                .increment("value", valueDifference);

            setRanks(user.id);

            socketServer.emit("crafted", {
                items: [
                    {
                        "id": item1.name_id,
                        "image": item1.image
                    },
                    {
                        "id": item2.name_id,
                        "image": item2.image
                    },
                    {
                        "id": craftedItem.name_id,
                        "image": craftedItem.image
                    }
                ],
                user: user.platform_id
            });

            clearUserCache(user.platform_id);

            return res.status(200).json({ message: "Success" });
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }

    /**
     * GET /crafting/recipes
     * @summary Get all crafting recipes
     * @tags Items
     * @return {object} 200 - Success
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * [
     * {
     *    "item1_id": "ap",
     *    "item2_id": "bp",
     *    "crafted_id": "bn"
     * },
     * {
     *    "item1_id": "ap",
     *    "item2_id": "rcp",
     *    "crafted_id": "rn"
     * }
     * ]
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @GET("crafting/recipes")
    async get(req: Request, res: Response) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        try {
            const recipes = await db("crafting").select("*");

            return res.status(200).json(recipes);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
}
