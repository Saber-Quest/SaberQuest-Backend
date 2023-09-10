import { randomInt } from "crypto";
import db from "../../db";
import { User } from "../../models/user";
import { Item } from "../../models/item";
import { ChallengeHistory } from "../../models/challengeHistory";

async function getRandomItem(rarity: string) {
    const item = await db<Item>("items")
        .select("name_id", "value")
        .where("rarity", rarity)
        .orderByRaw("RANDOM()")
        .first();

    return {
        id: item.name_id,
        rarity: rarity,
        value: item.value
    };
}

const itemChances = {
    1: {
        common: 0.75,
        uncommon: 0.90,
        rare: 0.95,
        epic: 0.99,
    },
    2: {
        common: 0.7,
        uncommon: 0.85,
        rare: 0.93,
        epic: 0.99,
    }
}

async function Normal() {
    const qp = randomInt(5, 15);
    const items = randomInt(1, 3);
    const itemArray = [];

    for (let i = 0; i < items; i++) {
        const rarity = Math.random();

        if (rarity <= itemChances[1].common) {
            const item = await getRandomItem("Common");
            itemArray.push(item);
        } else if (rarity <= itemChances[1].uncommon) {
            const item = await getRandomItem("Uncommon");
            itemArray.push(item);
        } else if (rarity <= itemChances[1].rare) {
            const item = await getRandomItem("Rare");
            itemArray.push(item);
        } else if (rarity <= itemChances[1].epic) {
            const item = await getRandomItem("Epic");
            itemArray.push(item);
        } else {
            const item = await getRandomItem("Legendary");
            itemArray.push(item);
        }
    }

    return {
        qp: qp,
        items: itemArray,
        value: itemArray.reduce((a, b) => a + b.value, 0)
    }
}

async function Hard() {
    const qp = randomInt(10, 20);
    let items = randomInt(1, 4);

    if (items > 3) {
        items = 3;
    }

    const itemArray = [];

    for (let i = 0; i < items; i++) {
        const rarity = Math.random();

        if (rarity <= itemChances[2].common) {
            const item = await getRandomItem("Common");
            itemArray.push(item);
        } else if (rarity <= itemChances[2].uncommon) {
            const item = await getRandomItem("Uncommon");
            itemArray.push(item);
        } else if (rarity <= itemChances[2].rare) {
            const item = await getRandomItem("Rare");
            itemArray.push(item);
        } else if (rarity <= itemChances[2].epic) {
            const item = await getRandomItem("Epic");
            itemArray.push(item);
        } else {
            const item = await getRandomItem("Legendary");
            itemArray.push(item);
        }
    }

    return {
        qp: qp,
        items: itemArray,
        value: itemArray.reduce((a, b) => a + b.value, 0)
    }
}

async function Expert() {
    const qp = randomInt(15, 25);

    let items = randomInt(1, 5);

    if (items > 3) {
        items = 3;
    }

    const itemArray = [];

    for (let i = 0; i < items; i++) {
        const rarity = Math.random();

        if (rarity <= itemChances[2].common) {
            const item = await getRandomItem("Common");
            itemArray.push(item);
        } else if (rarity <= itemChances[2].uncommon) {
            const item = await getRandomItem("Uncommon");
            itemArray.push(item);
        } else if (rarity <= itemChances[2].rare) {
            const item = await getRandomItem("Rare");
            itemArray.push(item);
        } else if (rarity <= itemChances[2].epic) {
            const item = await getRandomItem("Epic");
            itemArray.push(item);
        } else {
            const item = await getRandomItem("Legendary");
            itemArray.push(item);
        }
    }

    return {
        qp: qp,
        items: itemArray,
        value: itemArray.reduce((a, b) => a + b.value, 0)
    }
}

export default async function giveRewards(id: string, diff: number, challengeId: string) {
    const user = await db<User>("users")
        .select("id", "qp", "value")
        .where("platform_id", id)
        .first();

    if (!user) {
        return false;
    }

    let rewards;

    if (diff === 1) {
        rewards = await Normal();
    }

    if (diff === 2) {
        rewards = await Hard();
    }

    if (diff === 3) {
        rewards = await Expert();
    }

    await db<User>("users")
        .where("users.platform_id", id)
        .update({
            qp: user.qp + rewards.qp,
            value: user.value + rewards.value
        });

    await db<ChallengeHistory>("challenge_histories")
        .insert({
            user_id: user.id,
            challenge_id: challengeId,
            date: new Date().toISOString(),
            item_ids: rewards.items.join(","),
            difficulty: diff,
            qp: rewards.qp
        });

    await fetch(`${process.env.REDIRECT_URI_API}/items/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,
            items: rewards.items.map(item => item.id),
            authorization_code: process.env.AUTHORIZATION_CODE
        })
    });

    return rewards;
}