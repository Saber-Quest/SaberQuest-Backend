import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    //TODO: put actual stuff here
    return knex.schema.createTable('DailyChallenges', function (table) {
        table.string('type', 20);
        table.specificType('difficulties', 'jsonb[]');
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTable('DailyChallenges');
}