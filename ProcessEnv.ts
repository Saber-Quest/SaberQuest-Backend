import { z } from "zod";

export const env = z.object({
    DATABASE_URL: z.string(),
    PORT: z.string(),
    SOCKET_PORT: z.string(),
    REDIRECT_URI: z.string(),
    REDIRECT_URI_API: z.string(),
    JWT_SECRET: z.string(),
    AUTHORIZATION_CODE: z.string(),
    BEATLEADER_SECRET: z.string(),
    BEATLEADER_ID: z.string(),
    PROD_PATH: z.string(),
    DISCORD_SECRET: z.string(),
    DISCORD_ID: z.string(),
    PATREON_SECRET: z.string(),
    PATREON_ID: z.string(),
});

declare global {
    // eslint-disable-next-line no-unused-vars
    namespace NodeJS {
        // eslint-disable-next-line no-unused-vars
        interface ProcessEnv extends z.infer<typeof env> {}
    }
}