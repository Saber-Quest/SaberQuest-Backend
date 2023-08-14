import { Request, Response } from "express";
import { GET, POST } from "../../router";
import { Item } from "../../models/item";
import db from "../../db";
import { IUserItem } from "../../types/user";

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

    @POST("items/add")
    async post(req: Request, res: Response) {
        const { items, id } = req.body;
        
        const DbItems = await db("items")
            .select("*")
            .then((items) => {
                return items;
            }
        );

        const person = await db("users")
            .select("items")
            .where("id", id)
            .first()

        const personItems = person.items;

        const itemsArray: IUserItem[] = [];

        for (const item of items) {
            const personItem = personItems.find((personItem) => personItem.id === item);
            if (personItem) {
                if (item === "rs" || item === "bs") {
                    personItem.amount += 10;
                    continue;
                }
                personItem.amount++;
                continue;
            }
            const itemIndex = DbItems.findIndex((dbItem) => dbItem.id === item);
            if (itemIndex === -1) {
                return res.status(404).json({ message: "Item not found." });
            }

            console.log(DbItems[itemIndex]);

            const itemData = DbItems[itemIndex]
            if (item === "rs" || item === "bs") {
                itemData.amount = 10;
                itemsArray.push(itemData);
                continue;
            }
            itemData.amount = 1;
            itemsArray.push(itemData);
        }

        const newItems = [
            ...personItems,
            ...itemsArray,
        ];

        await db("users")
            .where("id", id)
            .update({
                items: newItems,
            })
            .then(() => {
                console.log("Items added to inventory.");
                return res.status(200).send("Items added to inventory.");
            }
        ).catch((err) => {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "An error occurred, please try again later.",
            });
        });
    }
}
