import knex, { Knex } from "knex";
import { User } from "./models/user";
import { Challenge } from "./models/challenge";
import { Item } from "./models/item";
import { ShopItem } from "./models/shopItem";
import { ChallengeHistory } from "./models/challengeHistory";
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
