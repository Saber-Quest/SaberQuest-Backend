import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("challengeSets").del();
    await knex("challenges").del();

    // Inserts seed entries
    await knex("challengeSets").insert([
        {
            id: 'daily',
            name: 'Daily Challenges',
            type: 'xAccuracyStars',
            image: '',
            resetTime: new Date() //placeholder
        }
    ]);

    await knex("Challenges").insert([
        {
            challengeSet: 'daily',
            difficulty: 'Easy',
            values: {
                "ss": [2,5, 90],
                "bl": [3, 90]
            }
        },
        {
            challengeSet: 'daily',
            difficulty: 'Normal',
            values: {
                "ss": [4, 92],
                "bl": [5, 92]
            }
        },
        {
            challengeSet: 'daily',
            difficulty: 'Hard',
            values: {
                "ss": [7, 94.5],
                "bl": [8, 94.5]
            }
        },
        {
            challengeSet: 'daily',
            difficulty: 'Extreme',
            values: {
                "ss": [9, 96.5],
                "bl": [10, 96.5]
            }
        }
    ])
};
