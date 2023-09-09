import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("items", (table) => {
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.string("name_id");
        table.string("image");
        table.string("name");
        table.integer("value");
        table.string("rarity");
    });

    await knex.schema.createTable("shop_items", (table) => {
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.uuid("item_id");
        table
            .foreign("item_id")
            .references("id")
            .inTable("items")
            .onDelete("CASCADE");
        table.integer("price");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("shop_items");
    await knex.schema.dropTable("items");
}
