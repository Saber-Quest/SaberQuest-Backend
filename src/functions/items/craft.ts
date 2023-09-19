import db from "../../db";
import { Crafting } from "../../models/crafting";

export async function Craft(item1: string, item2: string): Promise<string> {
    const option1 = await db<Crafting>("crafting")
        .select("crafted_id")
        .where("item1_id", item1)
        .andWhere("item2_id", item2)
        .first();

    if (!option1) {
        const option2 = await db<Crafting>("crafting")
            .select("crafted_id")
            .where("item1_id", item2)
            .andWhere("item2_id", item1)
            .first();

        if (!option2) {
            return "";
        }

        return option2.crafted_id;
    }

    return option1.crafted_id;
}