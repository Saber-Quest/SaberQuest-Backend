import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('shopItems', function (table) {
        table.string('id', 20);
        table.integer('price').nullable();
        table.string('rarity', 20);
        table.integer('value');
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTable('shopItems');
}

