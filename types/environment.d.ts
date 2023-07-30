import { CipherGCMTypes, CipherKey } from "crypto";

export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ALGORITHM: CipherGCMTypes;
            ENCRYPTION_KEY: string;
            MONGO_URL: string;
            DISCORD_SECRET: string;
            DISCORD_ID: string;
            BEATLEADER_SECRET: string;
            BEATLEADER_ID: string;
        }
    }
}