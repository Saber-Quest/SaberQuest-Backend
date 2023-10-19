import type { Request, Response } from "express";
import { GET, POST } from "../../router";
import { ShopItem } from "../../models/shopItem";
import db from "../../db";
import { Item } from "../../models/item";
import { verifyJWT } from "../../functions/users/jwtVerify";
import { User } from "../../models/user";
import { UserItem } from "../../models/userItem";

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
    @GET("items/shop")
    async get(req: Request, res: Response) {
        try {
            res.setHeader("Access-Control-Allow-Origin", "*");

            const shop = await db<ShopItem>("shop_items")
                .select("*");

            const itemMap = shop.map(async (item) => {
                const itemObject = await db<Item>("items")
                    .select("*")
                    .where("id", item.id)
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
                reset_time: new Date(shop[0].date).getTime() + (1000 * 60 * 60 * 24)
            });
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    }

    /**
     * Buy shop item
     * @typedef {object} BuyShopItem
     * @property {string} token.required - JWT token
     * @property {string} itemId.required - Item id
     */

    /**
     * POST /items/shop/buy
     * @summary Buy shop item
     * @tags Items
     * @param {BuyShopItem} request.body.required - Buy shop item request
     * @return {string} 200 - Success
     * @return {object} 400 - Missing fields
     * @return {object} 400 - Not enough qp
     * @return {object} 404 - Item not in shop
     * @return {object} 401 - Token expired
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * "OK"
     * @example response - 400 - Missing fields
     * {
     * "error": "Missing fields"
     * }
     * @example response - 400 - Not enough qp
     * {
     * "error": "Not enough qp"
     * }
     * @example response - 404 - Item not in shop
     * {
     * "error": "Item not in shop"
     * }
     * @example response - 401 - Token expired
     * {
     * "error": "Token expired"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     * 
     */

    @POST("items/shop/buy")
    async buy(req: Request, res: Response) {
        try {
            const { token, itemId } = req.body;

            if (!token || !itemId) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const jwt = verifyJWT(token);

            if (jwt === null) {
                return res.status(401).json({ error: "Token expired" });
            }

            const user = await db<User>("users")
                .select("id", "platform_id", "qp")
                .where("platform_id", jwt.id)
                .first();

            const shop = await db<ShopItem>("shop_items")
                .select("*");

            for (const item of shop) {
                if (item.name_id === itemId.toLowerCase()) {
                    if (user.qp < item.price) {
                        return res.status(400).json({ error: "Not enough qp" });
                    } else {
                        await db<User>("users")
                            .where("platform_id", jwt.id)
                            .update({
                                qp: user.qp - item.price
                            });

                        const userItems = await db<UserItem>("user_items")
                            .where("user_id", user.id);

                        let hasItem = false;

                        for (const userItem of userItems) {
                            if (userItem.item_id === item.id) {
                                hasItem = true;
                            }
                        }

                        if (hasItem) {
                            await db<UserItem>("user_items")
                                .where("user_id", user.id)
                                .andWhere("item_id", item.id)
                                .increment("amount", 1);
                        } else {
                            await db<UserItem>("user_items")
                                .insert({
                                    user_id: user.id,
                                    item_id: item.id,
                                    amount: 1
                                });
                        }

                        return res.sendStatus(200);
                    }
                }
            }

            return res.status(404).json({ error: "Item not in shop" });

        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    }
}
