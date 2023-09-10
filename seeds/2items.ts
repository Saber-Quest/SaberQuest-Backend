import { Knex } from "knex";
import { Item } from "../src/models/item";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("items").del();
    await knex("shop_items").del();

    // Inserts seed entries
    await knex("items").insert([
        {
            name_id: "ap",
            image: "https://saberquest.xyz/images/arrow_pieces_icon.png",
            name: "Arrow Pieces",
            value: 3,
            price: 5,
            rarity: "Common"
        },
        {
            name_id: "bcn",
            image: "https://saberquest.xyz/images/badcut_notes_icon.png",
            name: "Bad Cut Notes",
            value: 3,
            price: 5,
            rarity: "Common"
        },
        {
            name_id: "bp",
            image: "https://saberquest.xyz/images/blue_cube_pieces_icon.png",
            name: "Blue Note Pieces",
            value: 3,
            price: 5,
            rarity: "Common"
        },
        {
            name_id: "bd",
            image: "https://saberquest.xyz/images/blue_debris_icon.png",
            name: "Blue Debris",
            value: 3,
            price: 5,
            rarity: "Uncommon"
        },
        {
            name_id: "bn",
            image: "https://saberquest.xyz/images/blue_notes_icon.png",
            name: "Blue Notes",
            value: 1,
            price: 5,
            rarity: "Common"
        },
        {
            name_id: "bs",
            image: "https://saberquest.xyz/images/blue_saber_icon.png",
            name: "Blue Saber",
            value: 0,
            price: 5,
            rarity: "Rare"
        },
        {
            name_id: "b",
            image: "https://saberquest.xyz/images/bombs_icon.png",
            name: "Bombs",
            value: 3,
            price: 5,
            rarity: "Uncommon"
        },
        {
            name_id: "bt",
            image: "https://saberquest.xyz/images/bsmg_token.png",
            name: "BSMG Token",
            value: 3,
            price: 5,
            rarity: "Legendary"
        },
        {
            name_id: "ht",
            image: "https://saberquest.xyz/images/hitbloq_token.png",
            name: "Hitbloq Token",
            value: 3,
            price: 5,
            rarity: "Legendary"
        },
        {
            name_id: "cw",
            image: "https://saberquest.xyz/images/crouch_wall_icon.png",
            name: "Crouch Wall",
            value: 3,
            price: 5,
            rarity: "Rare"
        },
        {
            name_id: "ct",
            image: "https://saberquest.xyz/images/cube_community_token.png",
            name: "CC Token",
            value: 3,
            price: 5,
            rarity: "Legendary"
        },
        {
            name_id: "gn",
            image: "https://saberquest.xyz/images/golden_note_icon.png",
            name: "Golden Note",
            value: 3,
            price: 5,
            rarity: "Legendary"
        },
        {
            name_id: "gp",
            image: "https://saberquest.xyz/images/golden_pieces_icon.png",
            name: "Golden Pieces",
            value: 3,
            price: 5,
            rarity: "Legendary"
        },
        {
            name_id: "rcp",
            image: "https://saberquest.xyz/images/red_cube_pieces_icon.png",
            name: "Red Note Pieces",
            value: 3,
            price: 5,
            rarity: "Common"
        },
        {
            name_id: "rd",
            image: "https://saberquest.xyz/images/red_debris_icon.png",
            name: "Red Debris",
            value: 3,
            price: 5,
            rarity: "Uncommon"
        },
        {
            name_id: "rn",
            image: "https://saberquest.xyz/images/red_notes_icon.png",
            name: "Red Notes",
            value: 3,
            price: 5,
            rarity: "Common"
        },
        {
            name_id: "rs",
            image: "https://saberquest.xyz/images/red_saber_icon.png",
            name: "Red Saber",
            value: 3,
            price: 5,
            rarity: "Rare"
        },
        {
            name_id: "st",
            image: "https://saberquest.xyz/images/scoresaber_token.png",
            name: "ScoreSaber Token",
            value: 3,
            price: 5,
            rarity: "Legendary"
        },
        {
            name_id: "sn",
            image: "https://saberquest.xyz/images/silver_note_icon.png",
            name: "Silver Note",
            value: 3,
            price: 5,
            rarity: "Epic"
        },
        {
            name_id: "sp",
            image: "https://saberquest.xyz/images/silver_pieces_icon.png",
            name: "Silver Pieces",
            value: 3,
            price: 5,
            rarity: "Epic"
        },
        {
            name_id: "w",
            image: "https://saberquest.xyz/images/wall_icon.png",
            name: "Wall",
            value: 3,
            price: 5,
            rarity: "Rare"
        },
        {
            name_id: "115",
            image: "https://saberquest.xyz/images/115.png",
            name: "115",
            value: 3,
            price: 5,
            rarity: "Legendary"
        },
        {
            name_id: "bpp",
            image: "https://saberquest.xyz/images/blue_poodle_icon.png",
            name: "Blue Poodle",
            value: 3,
            price: 5,
            rarity: "Epic"
        },
        {
            name_id: "bsl",
            image: "https://saberquest.xyz/images/blue_slname_ider_icon.png",
            name: "Blue Slider",
            value: 3,
            price: 5,
            rarity: "Rare"
        },
        {
            name_id: "bst",
            image: "https://saberquest.xyz/images/blue_stack.png",
            name: "Blue Stack",
            value: 3,
            price: 5,
            rarity: "Rare"
        },
        {
            name_id: "bto",
            image: "https://saberquest.xyz/images/blue_tower.png",
            name: "Blue Tower",
            value: 3,
            price: 5,
            rarity: "Epic"
        },
        {
            name_id: "br",
            image: "https://saberquest.xyz/images/bomb_reset_icon.png",
            name: "Bomb Reset",
            value: 3,
            price: 5,
            rarity: "Rare"
        },
        {
            name_id: "dn",
            image: "https://saberquest.xyz/images/double_notes_icon.png",
            name: "Double Notes",
            value: 3,
            price: 5,
            rarity: "Uncommon"
        },
        {
            name_id: "rpp",
            image: "https://saberquest.xyz/images/red_poodle_icon.png",
            name: "Red Poodle",
            value: 3,
            price: 5,
            rarity: "Epic"
        },
        {
            name_id: "rsl",
            image: "https://saberquest.xyz/images/red_slname_ider_icon.png",
            name: "Red Slider",
            value: 3,
            price: 5,
            rarity: "Rare"
        },
        {
            name_id: "rst",
            image: "https://saberquest.xyz/images/red_stack.png",
            name: "Red Stack",
            value: 3,
            price: 5,
            rarity: "Rare"
        },
        {
            name_id: "rto",
            image: "https://saberquest.xyz/images/red_tower.png",
            name: "Red Tower",
            value: 3,
            price: 5,
            rarity: "Epic"
        }
    ]);

    const items = [];
    const possibleItems = await knex<Item>("items").select("*");

    for (let i = 0; i < 4; i++) {
        const random = Math.floor(Math.random() * possibleItems.length);
        items.push(possibleItems[random].name_id);
        possibleItems.splice(random, 1);
    }

    await knex("shop_items").insert({
        date: new Date().toISOString(),
        item_ids: items.join(",")
    });
}
