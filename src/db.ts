import knex, { Knex } from "knex";
import { User } from "./models/user";
import { Challenge } from "./models/challenge";
import { Item } from "./models/item";
import { Shop } from "./models/shop";
import { ChallengeHistory } from "./models/challengeHistory";
import { RewardedChallenge } from "./models/pastChallengeReward";
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

declare module "knex/types/tables.js" {
    // eslint-disable-next-line no-unused-vars
    interface Tables {
        users: User;
        challenges: Challenge;
        chistory: ChallengeHistory;
        pastcreward: RewardedChallenge;
        shop: Shop;
        item: Item;
    }
}
