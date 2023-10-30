import { Knex } from "knex";
import { Item } from "../src/models/item";
import { Crafting } from "../src/models/crafting";
import { ShopItem } from "../src/models/shopItem";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("items").del();
    await knex("shop_items").del();
    await knex("crafting").del();

    // Inserts seed entries
    await knex<Item>("items").insert([
        new Item("ap", "Arrow Pieces", 1, "https://saberquest.xyz/images/arrow_pieces_icon.png", "Common", 3),
        new Item("bcn", "Bad Cut Notes", 1, "https://saberquest.xyz/images/badcut_notes_icon.png", "Common", 3),
        new Item("bp", "Blue Note Pieces", 1, "https://saberquest.xyz/images/blue_cube_pieces_icon.png", "Common", 3),
        new Item("bd", "Blue Debris", 3, "https://saberquest.xyz/images/blue_debris_icon.png", "Uncommon", 3),
        new Item("bn", "Blue Notes", 4, "https://saberquest.xyz/images/blue_notes_icon.png", "Common", 3),
        new Item("bs", "Blue Saber", 0, "https://saberquest.xyz/images/blue_saber_icon.png", "Rare", 3),
        new Item("b", "Bombs", 5, "https://saberquest.xyz/images/bombs_icon.png", "Uncommon", 3),
        new Item("bt", "BSMG Token", 35, "https://saberquest.xyz/images/bsmg_token.png", "Legendary", 3),
        new Item("ht", "Hitbloq Token", 35, "https://saberquest.xyz/images/hitbloq_token.png", "Legendary", 3),
        new Item("cw", "Crouch Wall", 8, "https://saberquest.xyz/images/crouch_wall_icon.png", "Rare", 3),
        new Item("ct", "CC Token", 35, "https://saberquest.xyz/images/cube_community_token.png", "Legendary", 3),
        new Item("gn", "Golden Note", 45, "https://saberquest.xyz/images/golden_note_icon.png", "Legendary", 3),
        new Item("gp", "Golden Pieces", 3, "https://saberquest.xyz/images/golden_pieces_icon.png", "Legendary", 3),
        new Item("rcp", "Red Note Pieces", 1, "https://saberquest.xyz/images/red_cube_pieces_icon.png", "Common", 3),
        new Item("rd", "Red Debris", 8, "https://saberquest.xyz/images/red_debris_icon.png", "Uncommon", 3),
        new Item("rn", "Red Notes", 4, "https://saberquest.xyz/images/red_notes_icon.png", "Common", 3),
        new Item("rs", "Red Saber", 0, "https://saberquest.xyz/images/red_saber_icon.png", "Rare", 3),
        new Item("st", "ScoreSaber Token", 35, "https://saberquest.xyz/images/scoresaber_token.png", "Legendary", 3),
        new Item("sn", "Silver Note", 25, "https://saberquest.xyz/images/silver_note_icon.png", "Epic", 3),
        new Item("sp", "Silver Pieces", 5, "https://saberquest.xyz/images/silver_pieces_icon.png", "Epic", 3),
        new Item("w", "Wall", 5, "https://saberquest.xyz/images/wall_icon.png", "Rare", 3),
        new Item("115", "115", 7, "https://saberquest.xyz/images/115.png", "Legendary", 3),
        new Item("bpp", "Blue Poodle", 50, "https://saberquest.xyz/images/blue_poodle_icon.png", "Epic", 3),
        new Item("bsl", "Blue Slider", 20, "https://saberquest.xyz/images/blue_slider_icon.png", "Rare", 3),
        new Item("bst", "Blue Stack", 10, "https://saberquest.xyz/images/blue_stack.png", "Rare", 3),
        new Item("bto", "Blue Tower", 16, "https://saberquest.xyz/images/blue_tower.png", "Epic", 3),
        new Item("br", "Bomb Reset", 30, "https://saberquest.xyz/images/bomb_reset_icon.png", "Rare", 3),
        new Item("dn", "Double Notes", 12, "https://saberquest.xyz/images/double_notes_icon.png", "Uncommon", 3),
        new Item("rpp", "Red Poodle", 50, "https://saberquest.xyz/images/red_poodle_icon.png", "Epic", 3),
        new Item("rsl", "Red Slider", 20, "https://saberquest.xyz/images/red_slider_icon.png", "Rare", 3),
        new Item("rst", "Red Stack", 10, "https://saberquest.xyz/images/red_stack.png", "Rare", 3),
        new Item("rto", "Red Tower", 16, "https://saberquest.xyz/images/red_tower.png", "Epic", 3),
    ]);

    const items = [];
    const possibleItems = await knex<Item>("items").select("*");

    for (let i = 0; i < 5; i++) {
        const random = Math.floor(Math.random() * possibleItems.length);
        items.push({
            id: possibleItems[random].id,
            name_id: possibleItems[random].name_id,
            name: possibleItems[random].name,
            image: possibleItems[random].image,
            rarity: possibleItems[random].rarity,
            price: possibleItems[random].price
        });
        possibleItems.splice(random, 1);
    }

    for (const item of items) {
        await knex<ShopItem>("shop_items").insert({
            id: item.id,
            name_id: item.name_id,
            name: item.name,
            rarity: item.rarity,
            price: item.price,
            image: item.image,
            date: new Date().toISOString()
        });
    }

    await knex<Crafting>("crafting").insert([
        new Crafting("ap", "bp", "bn"),
        new Crafting("ap", "rcp", "rn"),
        new Crafting("ap", "bto", "bsl"),
        new Crafting("ap", "rto", "rsl"),
        new Crafting("bn", "rn", "dn"),
        new Crafting("bn", "bn", "bst"),
        new Crafting("bn", "bst", "bto"),
        new Crafting("bn", "bs", "bd"),
        new Crafting("bn", "rs", "bcn"),
        new Crafting("bn", "sp", "sn"),
        new Crafting("b", "dn", "br"),
        new Crafting("rn", "rn", "rst"),
        new Crafting("rn", "rs", "rsl"),
        new Crafting("rn", "bs", "bd"),
        new Crafting("rn", "bn", "bst"),
        new Crafting("rn", "sp", "sn"),
        new Crafting("gp", "sn", "gn"),
        new Crafting("rsl", "rsl", "rpp"),
        new Crafting("bsl", "bsl", "bpp"),
    ]);
}
