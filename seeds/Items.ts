import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("Items").del();

    // Inserts seed entries
    await knex("Items").insert([
        {
            id: "ap",
            image: "https://saberquest.xyz/images/arrow_pieces_icon.png",
            name: "Arrow Pieces"
        },
        {
            id: "bcn",
            image: "https://saberquest.xyz/images/badcut_notes_icon.png",
            name: "Bad Cut Notes"
        },
        {
            id: "bp",
            image: "https://saberquest.xyz/images/blue_cube_pieces_icon.png",
            name: "Blue Note Pieces"
        },
        {
            id: "bd",
            image: "https://saberquest.xyz/images/blue_debris_icon.png",
            name: "Blue Debris"
        },
        {
            id: "bn",
            image: "https://saberquest.xyz/images/blue_notes_icon.png",
            name: "Blue Notes"
        },
        {
            id: "bs",
            image: "https://saberquest.xyz/images/blue_saber_icon.png",
            name: "Blue Saber"
        },
        {
            id: "b",
            image: "https://saberquest.xyz/images/bombs_icon.png",
            name: "Bombs"
        },
        {
            id: "bt",
            image: "https://saberquest.xyz/images/bsmg_token.png",
            name: "BSMG Token"
        },
        {
            id: "ht",
            image: "https://saberquest.xyz/images/hitbloq_token.png",
            name: "Hitbloq Token"
        },
        {
            id: "cw",
            image: "https://saberquest.xyz/images/crouch_wall_icon.png",
            name: "Crouch Wall"
        },
        {
            id: "ct",
            image: "https://saberquest.xyz/images/cube_community_token.png",
            name: "CC Token"
        },
        {
            id: "gn",
            image: "https://saberquest.xyz/images/golden_note_icon.png",
            name: "Golden Note"
        },
        {
            id: "gp",
            image: "https://saberquest.xyz/images/golden_pieces_icon.png",
            name: "Golden Pieces"
        },
        {
            id: "rcp",
            image: "https://saberquest.xyz/images/red_cube_pieces_icon.png",
            name: "Red Note Pieces"
        },
        {
            id: "rd",
            image: "https://saberquest.xyz/images/red_debris_icon.png",
            name: "Red Debris"
        },
        {
            id: "rn",
            image: "https://saberquest.xyz/images/red_notes_icon.png",
            name: "Red Notes"
        },
        {
            id: "rs",
            image: "https://saberquest.xyz/images/red_saber_icon.png",
            name: "Red Saber"
        },
        {
            id: "st",
            image: "https://saberquest.xyz/images/scoresaber_token.png",
            name: "ScoreSaber Token"
        },
        {
            id: "sn",
            image: "https://saberquest.xyz/images/silver_note_icon.png",
            name: "Silver Note"
        },
        {
            id: "sp",
            image: "https://saberquest.xyz/images/silver_pieces_icon.png",
            name: "Silver Pieces"
        },
        {
            id: "w",
            image: "https://saberquest.xyz/images/wall_icon.png",
            name: "Wall"
        },
        {
            id: "115",
            image: "https://saberquest.xyz/images/115.png",
            name: "115"
        },
        {
            id: "bpp",
            image: "https://saberquest.xyz/images/blue_poodle_icon.png",
            name: "Blue Poodle"
        },
        {
            id: "bsl",
            image: "https://saberquest.xyz/images/blue_slider_icon.png",
            name: "Blue Slider"
        },
        {
            id: "bst",
            image: "https://saberquest.xyz/images/blue_stack.png",
            name: "Blue Stack"
        },
        {
            id: "bto",
            image: "https://saberquest.xyz/images/blue_tower.png",
            name: "Blue Tower"
        },
        {
            id: "br",
            image: "https://saberquest.xyz/images/bomb_reset_icon.png",
            name: "Bomb Reset"
        },
        {
            id: "dn",
            image: "https://saberquest.xyz/images/double_notes_icon.png",
            name: "Double Notes"
        },
        {
            id: "rpp",
            image: "https://saberquest.xyz/images/red_poodle_icon.png",
            name: "Red Poodle"
        },
        {
            id: "rsl",
            image: "https://saberquest.xyz/images/red_slider_icon.png",
            name: "Red Slider"
        },
        {
            id: "rst",
            image: "https://saberquest.xyz/images/red_stack.png",
            name: "Red Stack"
        },
        {
            id: "rto",
            image: "https://saberquest.xyz/images/red_tower.png",
            name: "Red Tower"
        }
    ]);
};
