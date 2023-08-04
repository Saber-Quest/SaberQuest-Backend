import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('Items', function (table) {
        table.string('id', 6);
        table.string('image', 70); //Most URLs have ~50 characters so we should pad it a bit to be safe.
        table.string('name', 25);
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTable('Items');
}

