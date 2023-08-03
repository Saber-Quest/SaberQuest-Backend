import knex, { Knex } from "knex";
import config from "./config.json";
import { User } from "./models/user";
import { Challenge } from "./models/challenge";

const db = knex({
    connection: config.db,
    client: "pg",
    version: "13",
    debug: true,
    migrations: {
        tableName: "migrations"
    }
});

export default db;

declare module "knex/types/tables.js" {
    interface Tables {
        users: User;
        challenges: Challenge;
    }
}