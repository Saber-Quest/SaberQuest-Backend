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
     * @tags items
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
     * POST /items/add
     * @summary Add items to a player's inventory
     * @tags items
     */
    @POST("items/add")
    async post(req: Request, res: Response): Promise<void | Response> {
        const { items, id } = req.body;

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
    }
}
