import type { Request, Response } from "express";
import { GET } from "../../router";
import { ShopItem } from "../../models/shopItem";
import db from "../../db";

export class ShopItems {
    @GET("shop/items")
    get(req: Request, res: Response) {
        db<ShopItem>("shop")
            .select({
                id: "id",
                price: "price",
                value: "value",
            })
            .then((users) => {
                return res.json(users);
            })
            .catch((err) => {
                console.error(err);
                return res.json({
                    success: false,
                    message: "An error occurred, please try again later.",
                });
            });
    }
}
