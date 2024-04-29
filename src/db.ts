import knex, { Knex } from "knex";
import config from "./config.json";

const db: Knex = knex({
    client: "pg",
    connection: config.db,
    version: "13",
    pool: {
        min: 2,
        max: 10,
    },
});

export default db;