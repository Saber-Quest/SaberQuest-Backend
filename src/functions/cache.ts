import apicache from "apicache";
import { Request } from "express";

const cache = apicache.options({
    debug: false,
    enabled: true,
    statusCodes: {
        exclude: [400, 401, 403, 404, 429, 500],
        include: [200, 304],
    },
}).middleware("1 hour");

function setCache(req: Request, name: string) {
    // @ts-ignore
    req.apicacheGroup = name;
}

function clearGlobalCache() {
    // @ts-ignore
    apicache.clear();
}

function clearUserCache(id: string) {
    apicache.clear(`profile:${id}`);
    apicache.clear(`inventory:${id}`);
    apicache.clear(`leaderboard:${id}`);
    apicache.clear("leaderboard");
}

function clearDailyCache() {
    apicache.clear("daily");
}

export { cache, setCache, clearGlobalCache, clearUserCache, clearDailyCache };