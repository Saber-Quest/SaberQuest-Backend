import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("items", (table) => {
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.string("name_id", 10)
        table.string("image", 70); //Most URLs have ~50 characters so we should pad it a bit to be safe.
        table.string("name", 25);
        table.integer("value");
    });

    await knex.schema.createTable("shop_items", function (table) {
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.integer("price").nullable();
        table.uuid("table_id");
        table
            .foreign("table_id")
            .references("id")
            .inTable("items")
            .onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("shop_items");
    await knex.schema.dropTable("items");
}
