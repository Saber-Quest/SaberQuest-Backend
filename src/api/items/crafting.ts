import { PATCH } from "../../router";
import db from "../../db";
import { Request, Response } from "express";
import { Item } from "../../models/item";
import { User } from "../../models/user";
import { Craft } from "../../functions/craft";
import { IUserItem } from "../../types/user";

// export class Crafting {
//     @PATCH("craft")
//     async post(req: Request, res: Response) {
//         const { id, used1, used2 } = req.body;

//         const person = await db<User>("users")
//             .select("items")
//             .where("id", id)
//             .first();

//         const personItems = person.items;

//         const used1Index = personItems.findIndex((personItem) => {
//             const json = JSON.parse(personItem.toString());
//             return json.id === used1;
//         });

//         const used2Index = personItems.findIndex((personItem) => {
//             const json = JSON.parse(personItem.toString());
//             return json.id === used2;
//         });

//         if (used1Index === -1 || used2Index === -1) {
//             return res.status(404).json({ message: "Item not found." });
//         }

//         const used1Data = JSON.parse(personItems[used1Index].toString());
//         const used2Data = JSON.parse(personItems[used2Index].toString());

//         if (used1Data.amount < 1 || used2Data.amount < 1) {
//             return res.status(400).json({ message: "Not enough items." });
//         }

//         used1Data.amount--;
//         used2Data.amount--;

//         const newItems: IUserItem[] = [...personItems];

//         for (const item in newItems) {
//             newItems[item] = JSON.parse(newItems[item].toString());
//         }

//         if (used1Data.amount === 0) {
//             newItems.splice(used1Index, 1);
//         } else {
//             newItems[used1Index] = used1Data;
//         }

//         if (used2Data.amount === 0) {
//             newItems.splice(used2Index, 1);
//         } else {
//             newItems[used2Index] = used2Data;
//         }

//         const crafted = Craft(used1, used2);

//         const craftedFiltered = newItems.filter(
//             (item) => item.name_id === crafted
//         );

//         if (craftedFiltered.length === 0) {
//             const allItems = await db<Item>("items")
//                 .select("*")
//                 .then((items) => {
//                     return items;
//                 });

//             const item = allItems.filter((item) => item.name_id === crafted)[0];

//             if (!item) {
//                 return res.status(404).json({ message: "Item not found." });
//             }

//             const newItem: IUserItem = {
//                 ...item,
//                 amount: 1,
//             };

//             const withCrafted: IUserItem[] = [...newItems, newItem];

//             let newValue = 0;

//             for (const item of withCrafted) {
//                 const dbItem: Item[] = allItems.filter(
//                     (dbItem) => dbItem.name_id === item.name_id
//                 );
//                 if (dbItem.length === 0) {
//                     return res.status(404).json({ message: "Item not found." });
//                 }

//                 newValue += dbItem[0].value * item.amount;
//             }

//             await db<User>("users").where("id", id).update({
//                 items: withCrafted,
//                 value: newValue,
//             });

//             return res.status(200).json({ message: "Item crafted." });
//         } else {
//             const craftedData = craftedFiltered[0];

//             craftedData.amount++;

//             const craftedIndex = newItems.findIndex(
//                 (item) => item.name_id === crafted
//             );

//             newItems[craftedIndex] = craftedData;

//             const allItems = await db<Item>("items")
//                 .select("*")
//                 .then((items) => {
//                     return items;
//                 });

//             let newValue = 0;

//             for (const item of newItems) {
//                 const dbItem: Item[] = allItems.filter(
//                     (dbItem) => dbItem.name_id === item.name_id
//                 );
//                 if (dbItem.length === 0) {
//                     return res.status(404).json({ message: "Item not found." });
//                 }

//                 newValue += dbItem[0].value * item.amount;
//             }

//             await db<User>("users").where("id", id).update({
//                 items: newItems,
//                 value: newValue,
//             });

//             return res.status(200).json({ message: "Item crafted." });
//         }
//     }
// }
