import db from "../../db";
import { User } from "../../models/user";

export default async function setRanks(id: string) {
    const user = await db<User>("users")
        .select("id", "rank", "value")
        .where("id", id)
        .first();

    if (!user) {
        return;
    }

    const usersWithHigherRank = await db<User>("users")
        .select("id", "rank")
        .where("rank", "<", user.rank)
        .andWhere("value", "<", user.value)
        .orderBy("rank", "desc");

    if (usersWithHigherRank.length === 0) {
        return;
    }

    let rank = user.rank;

    for (const user of usersWithHigherRank) {
        user.rank = rank;
        rank--;

        await db("users")
            .where("id", user.id)
            .update(user);
    }

    await db("users")
        .where("id", user.id)
        .update({ rank: rank });
}