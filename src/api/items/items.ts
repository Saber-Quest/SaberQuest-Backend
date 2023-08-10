import { Request, Response } from "express";
import { GET } from "../../router";
import { Item } from "../../models/item";
import db from "../../db";

export class Items {
    @GET("items/all")
    get(req: Request, res: Response) {
        db<Item>("items")
            .select({
                id: "id",
                image: "image",
                name: "name",
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
