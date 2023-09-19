import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("items", (table) => {
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.string("name_id").unique();
        table.string("image");
        table.string("name");
        table.integer("value");
        table.string("rarity");
        table.integer("price");
    });

    await knex.schema.createTable("shop_items", (table) => {
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.string("item_ids");
        table.integer("price");
        table.string("date");
    });

    await knex.schema.createTable("crafting", (table) => {
        table.string("item1_id")
            .references("name_id")
            .inTable("items")
            .onDelete("CASCADE");
        table.string("item2_id")
            .references("name_id")
            .inTable("items")
            .onDelete("CASCADE");
        table.string("crafted_id")
            .references("name_id")
            .inTable("items")
            .onDelete("CASCADE");
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("shop_items");
    await knex.schema.dropTable("items");
}
