import { Knex } from "knex";
import { ChallengeSet } from "../src/models/challengeSet";
import { Difficulty } from "../src/models/difficulty";
import { ChallengeHistory } from "../src/models/challengeHistory";
import { User } from "../src/models/user";
import { Item } from "../src/models/item";

export async function seed(knex: Knex): Promise<void> {
    await knex("difficulties").del();
    await knex("challenge_sets").del();
    await knex("challenge_histories").del();

    await knex<ChallengeSet>("challenge_sets").insert([
        {
            type: "pp",
            name: "PP Challenge",
            description: "Get a certain amount of PP on a single map."
        },
        {
            type: "map",
            name: "Play X Maps Challenge",
            description: "Play a certain amount of maps."
        },
        {
            type: "fcnotes",
            name: "FC Notes Challenge",
            description: "FC a map with a certain amount of notes."
        },
        {
            type: "passnotes",
            name: "Pass Notes Challenge",
            description: "Pass a map with a certain amount of notes."
        },
        {
            type: "fcstars",
            name: "FC Stars Challenge",
            description: "FC a map with a certain amount of stars."
        },
        {
            type: "xaccuracystars",
            name: "X Accuracy Stars Challenge",
            description: "Get a certain amount of accuracy on a map with a certain amount of stars."
        },
        {
            type: "xaccuracypp",
            name: "X Accuracy PP Challenge",
            description: "Get a certain amount of accuracy on a map while gaining a certain amount of pp."
        },
        {
            type: "xaccuracynotes",
            name: "X Accuracy Notes Challenge",
            description: "Get a certain amount of accuracy on a map with a certain amount of notes."
        }
    ]);

    const pp = await knex<ChallengeSet>("challenge_sets").select("*").where("type", "pp").first();
    const map = await knex<ChallengeSet>("challenge_sets").select("*").where("type", "map").first();
    const fcnotes = await knex<ChallengeSet>("challenge_sets").select("*").where("type", "fcnotes").first();
    const passnotes = await knex<ChallengeSet>("challenge_sets").select("*").where("type", "passnotes").first();
    const fcstars = await knex<ChallengeSet>("challenge_sets").select("*").where("type", "fcstars").first();
    const xaccuracystars = await knex<ChallengeSet>("challenge_sets").select("*").where("type", "xaccuracystars").first();
    const xaccuracypp = await knex<ChallengeSet>("challenge_sets").select("*").where("type", "xaccuracypp").first();
    const xaccuracynotes = await knex<ChallengeSet>("challenge_sets").select("*").where("type", "xaccuracynotes").first();

    await knex<Difficulty>("difficulties").insert([
        // -------------------------------- SET PP DIFFICULTIES --------------------------------
        {
            challenge_id: pp.id,
            challenge: [50, 70],
            diff: 1,
            color: "#FFD941"
        },
        {
            challenge_id: pp.id,
            challenge: [200, 250],
            diff: 2,
            color: "#E93B3B"
        },
        {
            challenge_id: pp.id,
            challenge: [400, 500],
            diff: 3,
            color: "#B74BF5"
        },
        // -------------------------------- SET MAP DIFFICULTIES --------------------------------
        {
            challenge_id: map.id,
            challenge: [3],
            diff: 1,
            color: "#FFD941"
        },
        {
            challenge_id: map.id,
            challenge: [8],
            diff: 2,
            color: "#E93B3B"
        },
        {
            challenge_id: map.id,
            challenge: [15],
            diff: 3,
            color: "#B74BF5"
        },
        // -------------------------------- SET FC NOTES DIFFICULTIES --------------------------------
        {
            challenge_id: fcnotes.id,
            challenge: [200],
            diff: 1,
            color: "#FFD941"
        },
        {
            challenge_id: fcnotes.id,
            challenge: [700],
            diff: 2,
            color: "#E93B3B"
        },
        {
            challenge_id: fcnotes.id,
            challenge: [1500],
            diff: 3,
            color: "#B74BF5"
        },
        // -------------------------------- SET PASS NOTES DIFFICULTIES --------------------------------
        {
            challenge_id: passnotes.id,
            challenge: [350],
            diff: 1,
            color: "#FFD941"
        },
        {
            challenge_id: passnotes.id,
            challenge: [1000],
            diff: 2,
            color: "#E93B3B"
        },
        {
            challenge_id: passnotes.id,
            challenge: [2500],
            diff: 3,
            color: "#B74BF5"
        },
        // -------------------------------- SET FC STARS DIFFICULTIES --------------------------------
        {
            challenge_id: fcstars.id,
            challenge: [2, 2.5],
            diff: 1,
            color: "#FFD941"
        },
        {
            challenge_id: fcstars.id,
            challenge: [5, 6.5],
            diff: 2,
            color: "#E93B3B"
        },
        {
            challenge_id: fcstars.id,
            challenge: [8.5, 10],
            diff: 3,
            color: "#B74BF5"
        },
        // -------------------------------- SET X ACCURACY STARS DIFFICULTIES --------------------------------
        {
            challenge_id: xaccuracystars.id,
            challenge: [2, 2.5, 90],
            diff: 1,
            color: "#FFD941"
        },
        {
            challenge_id: xaccuracystars.id,
            challenge: [5, 6.5, 92],
            diff: 2,
            color: "#E93B3B"
        },
        {
            challenge_id: xaccuracystars.id,
            challenge: [8.5, 10, 94],
            diff: 3,
            color: "#B74BF5"
        },
        // -------------------------------- SET X ACCURACY PP DIFFICULTIES --------------------------------
        {
            challenge_id: xaccuracypp.id,
            challenge: [100, 150, 90],
            diff: 1,
            color: "#FFD941"
        },
        {
            challenge_id: xaccuracypp.id,
            challenge: [300, 350, 92],
            diff: 2,
            color: "#E93B3B"
        },
        {
            challenge_id: xaccuracypp.id,
            challenge: [400, 500, 94],
            diff: 3,
            color: "#B74BF5"
        },
        // -------------------------------- SET X ACCURACY NOTES DIFFICULTIES --------------------------------
        {
            challenge_id: xaccuracynotes.id,
            challenge: [600, 75],
            diff: 1,
            color: "#FFD941"
        },
        {
            challenge_id: xaccuracynotes.id,
            challenge: [1000, 85],
            diff: 2,
            color: "#E93B3B"
        },
        {
            challenge_id: xaccuracynotes.id,
            challenge: [2000, 94],
            diff: 3,
            color: "#B74BF5"
        }
    ]);

    await knex<ChallengeHistory>("challenge_histories").insert([
        {
            challenge_id: pp.id,
            date: new Date().toISOString(),
        }
    ]);

    const todayAtMidnight = new Date().setUTCHours(0, 0, 0, 0);

    await knex<ChallengeHistory>("challenge_histories").insert([
        {
            challenge_id: map.id,
            date: new Date(todayAtMidnight).toISOString(),
        }
    ]);
}