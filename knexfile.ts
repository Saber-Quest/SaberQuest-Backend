import config from "./src/config.json";

module.exports = {
    development: {
        client: "pg",
        connection: config.db,
        version: "13",
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "migrations"
        }
    },
    staging: {
        client: "pg",
        connection: config.db,
        version: "13",
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "migrations"
        }
    },
    production: {
        client: "pg",
        connection: config.db,
        version: "13",
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "migrations"
        }
    }
};