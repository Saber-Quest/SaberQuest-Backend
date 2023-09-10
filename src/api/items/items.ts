import type { Request, Response } from "express";
import { GET, POST } from "../../router";
import { Item } from "../../models/item";
import db from "../../db";
import { UserItem } from "../../models/userItem";
import { User } from "../../models/user";
import { clearUserCache } from "../../functions/cache";

export class Items {
    /**
     * GET /items/all
     * @summary Get all items
     * @tags Items
     * @return {array<Item>} 200 - success response - application/json
     * @example response - 200 - success response example
     * [
     * {
     *   "id": "ap",
     *   "image": "https://saberquest.xyz/images/arrow_pieces_icon.png",
     *   "name": "Arrow Pieces",
     *   "value": 3
     * },
     * {
     *   "id": "bcn",
     *   "image": "https://saberquest.xyz/images/badcut_notes_icon.png",
     *   "name": "Bad Cut Notes",
     *   "value": 3
     * }
     * ]
     * @example response - 500 - An error occurred
     * {
     * "message": "An error occurred, please try again later."
     * }
     */
    @GET("items/all")
    get(req: Request, res: Response) {
        db<Item>("items")
            .select("*")
            .then((items) => {
                return res.json(items.map((item) => {
                    return {
                        id: item.name_id,
                        image: item.image,
                        name: item.name,
                        rarity: item.rarity,
                        value: item.value,
                        price: item.price,
                    };
                }));
            })
            .catch((err) => {
                console.error(err);
                return res.json({
                    message: "An error occurred, please try again later.",
                });
            });
    }

    /** 
     * Add Items
     * @typedef {object} AddItems
     * @property {string[]} items.required - The items to add
     * @property {string} id.required - The user's platform id
     * @property {string} authorization_code.required - The authorization code
     */

    /**
     * POST /items/add
     * @summary Add items to a player's inventory
     * @tags Items
     * @param {AddItems} request.body.required - The items to add
     * @return {object} 200 - Success
     * @return {object} 400 - Missing parameters
     * @return {string} 403 - Invalid authorization code
     * @return {object} 404 - User not found
     * @return {string} 500 - An error occurred
     * @example response - 200 - Success
     * {
     * "message": "Success."
     * }
     * @example response - 400 - Missing parameters
     * {
     * "message": "Missing parameters."
     * }
     * @example response - 403 - Invalid authorization code
     * "Forbidden"
     * @example response - 404 - User not found
     * {
     * "message": "User not found."
     * }
     * @example response - 500 - An error occurred
     * "Internal server error"
     */
    @POST("items/add")
    async post(req: Request, res: Response): Promise<void | Response> {
        try {
            const { items, id, authorization_code } = req.body;

            if (authorization_code !== process.env.AUTHORIZATION_CODE) {
                return res.sendStatus(403);
            }

            if (!items || !id) {
                return res.status(400).json({ message: "Missing parameters." });
            }

            const user = await db<User>("users")
                .select("id", "platform_id")
                .where("platform_id", id)
                .first();

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            const userItems = await db<UserItem>("user_items")
                .where("user_id", user.id);

            const itemsArray: string[] = [];

            for (const item of userItems) {
                itemsArray.push(item.item_id);
            }

            for (const item of items) {
                const itemData = await db<Item>("items")
                    .select("id")
                    .where("name_id", item)
                    .first();

                if (itemsArray.includes(itemData.id)) {
                    await db<UserItem>("user_items")
                        .where("user_id", user.id)
                        .andWhere("item_id", itemData.id)
                        .increment("amount", 1);
                } else {
                    await db<UserItem>("user_items")
                        .insert({
                            user_id: user.id,
                            item_id: itemData.id,
                            amount: 1,
                        });
                }
            }

            clearUserCache(user.platform_id);

            return res.status(200).json({ message: "Success." });
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
}
