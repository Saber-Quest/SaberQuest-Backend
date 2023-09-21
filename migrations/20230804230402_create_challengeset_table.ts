import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("challenge_sets", async (table) => {
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.string("type");
        table.string("name");
        table.string("description");
        table.string("image");
    });

    // id: string;
    // name: string;
    // description: string;
    // image: string;
    // reset_time: number;


    await knex.schema.createTable("difficulties", (table) => {
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.uuid("challenge_id")
            .references("id")
            .inTable("challenge_sets")
            .onDelete("CASCADE");
        table.specificType("challenge", "float ARRAY");
        table.integer("diff");
        table.string("color");
    });

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
        table.integer("value");
        table.integer("diff");
        table.boolean("auto_complete");
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
        table.uuid("user_id")
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
        table.uuid("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.uuid("challenge_id")
            .references("id")
            .inTable("challenge_sets")
            .onDelete("CASCADE");
        table.string("item_ids");
        table.integer("difficulty");
        table.integer("qp");
        table.string("date");
        table.string("preference");
    });

    // id: string;
    // challenges: Challenge[];
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users");
    await knex.schema.dropTable("challenge_histories");
    await knex.schema.dropTable("challenges");
    await knex.schema.dropTable("challenge_sets");
    await knex.schema.dropTable("difficulty");
}
