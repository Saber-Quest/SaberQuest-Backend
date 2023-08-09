import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("shopItems").del();

    // Inserts seed entries
    await knex("shopItems").insert([
        {
            id: "b",
            price: 15,
            rarity: "Uncommon",
            value: 5,
        }, {
            id: "br",
            price: 35,
            rarity: "Rare",
            value: 30,
        }, {
            id: "bs",
            price: 10,
            rarity: "Rare",
            value: 0,
        }, {
            id: "rto",
            price: 30,
            rarity: "Rare",
            value: 16,
        }, {
            id: "sp",
            price: 40,
            rarity: "Legendary",
            value: 5,
        }
    ]);
};
