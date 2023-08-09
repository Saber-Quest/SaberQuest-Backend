import knex, { Knex } from "knex";
import { User } from "./models/user";
import { Challenge } from "./models/challenge";
import { Item } from "./models/item";
import { Shop } from "./models/shop";

const environment = process.env.NODE_ENV || 'development';
const config = require("../knexfile")[environment];

const db: Knex = knex(config);

export default db;

declare module "knex/types/tables.js" {
    interface Tables {
        users: User;
        challenges: Challenge;
        shop: Shop;
        item: Item;
    }
}