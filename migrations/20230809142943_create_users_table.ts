import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', function (table) {
        table.string('id', 19);
        table.string('username', 40);
        table.string('avatar', 200);
        table.string('banner', 70);
        table.string('border', 70);
        table.string('preference', 2);
        table.integer('challengesCompleted');
        table.integer('rank');
        table.integer('qp');
        table.integer('value');
        table.integer('diff');
        table.boolean('completed');
        table.specificType('chistory', 'integer ARRAY');
        table.specificType('items', 'text ARRAY');
        })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTable('users')
}

