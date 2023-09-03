import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("difficulty", (table) => {
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.json("difficulty");
        table.string("color");
    });

    await knex.schema.createTable("challenge_sets", (table) => {
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.string("name");
        table.string("type");
        table.string("image");
        table.date("reset_time");
    });

    // id: string;
    // name: string;
    // type: string;
    // image: string;
    // reset_time: Date;

    await knex.schema.createTable("users", (table) => {
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.string("platform_id");
        table.string("username");
        table.string("avatar");
        table.string("banner");
        table.string("border");
        table.string("preference");
        table.string("discord_id");
        table.boolean("patreon");
        table.integer("rank");
        table.integer("qp");
    });

        // id: string;
    // username: string;
    // avatar: string;
    // banner: string;
    // border: string;
    // preference: string;
    // challenge_history_id: string;
    // challenge_history: ChallengeHistory;
    // items: string[];
    // challenges_completed: number;
    // rank: number;
    // qp: number;
    // value: number;
    // diff: number;
    // completed: boolean;

    await knex.schema.createTable("user_items", (table) => {
        table.uuid("user_id");
        table
            .foreign("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.uuid("item_id");
        table
            .foreign("item_id")
            .references("id")
            .inTable("items")
            .onDelete("CASCADE");
        table.integer("amount");
    });

    await knex.schema.createTable("challenges", (table) => {
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.uuid("challenge_set_id");
        table
            .foreign("challenge_set_id")
            .references("id")
            .inTable("challenge_sets")
            .onDelete("CASCADE");
        table.string("type");
        table.uuid("difficulty_id");
        table
            .foreign("difficulty_id")
            .references("id")
            .inTable("difficulty")
            .onDelete("CASCADE");
    });

    // id: string;
    // challenge_set: ChallengeSet;
    // challenge_set_id: string;
    // type: string;
    // difficulty: {
    //     easy: number;
    //     normal: number;
    //     hard: number;
    //     extreme: number;
    // }

    await knex.schema.createTable("challenge_histories", (table) => {
        table.uuid("user_id");
        table
            .foreign("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.uuid("challenge_id");
        table
            .foreign("challenge_id")
            .references("id")
            .inTable("challenges")
            .onDelete("CASCADE");
        table.uuid("item_id");
        table
            .foreign("item_id")
            .references("id")
            .inTable("items")
            .onDelete("CASCADE");
        table.date("date");
    });

    // id: string;
    // challenges: Challenge[];
    // date: Date; // UTC ISO string formatted.
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users");
    await knex.schema.dropTable("challenge_histories");
    await knex.schema.dropTable("challenges");
    await knex.schema.dropTable("challenge_sets");
    await knex.schema.dropTable("difficulty");
}
