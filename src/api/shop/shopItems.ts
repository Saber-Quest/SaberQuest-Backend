import { Request, Response } from "express";
import { GET } from "../../router";
import db from "../../db";

export class ShopItems {
    @GET("shop/items")
    get(req: Request, res: Response) {
        db("ShopItems")
            .select({
                id: "id",
                price: "price",
                rarity: "rarity",
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
