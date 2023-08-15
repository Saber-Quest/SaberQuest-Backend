import { z } from "zod";

export const env = z.object({
    DATABASE_URL: z.string(),
    PORT: z.string(),
    SOCKET_PORT: z.string(),
});

declare global {
    // eslint-disable-next-line no-unused-vars
    namespace NodeJS {
        // eslint-disable-next-line no-unused-vars
        interface ProcessEnv extends z.infer<typeof env> {}
    }
}