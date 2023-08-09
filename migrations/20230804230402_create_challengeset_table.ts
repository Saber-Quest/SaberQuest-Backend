import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('challengeSets', function (table) {
        table.string('id', 10);
        table.string('name', 25);
        table.string('type', 20);
        table.string('image', 70); //Most URLs have ~50 characters so we should pad it a bit to be safe.
        table.dateTime('resetTime');
        })
        .createTable('Challenges', function (table) {
            table.string('challengeSet', 10); //ID of parent challenge set
            table.string('difficulty', 10);
            table.jsonb('values');
            });
}


export async function down(knex: Knex): Promise<void> {
    //In development phase so a overcomplicated rollback isn't really needed here
    return knex.schema
        .dropTable('challengeSets')
        .dropTable('Challenges');
}

