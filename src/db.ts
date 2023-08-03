import knex, { Knex } from "knex";
import * as dbConfig from "./config.json";
import * as knexConfig from "../knexfile"
import { User } from "./models/user";
import { Challenge } from "./models/challenge";
import { Item } from "./models/item";
import { Shop } from "./models/shop";

const db: Knex = knex(knexConfig);

export default db;

declare module "knex/types/tables.js" {
    interface Tables {
        users: User;
        challenges: Challenge;
        shop: Shop;
        item: Item;
    }
}