import apicache from "apicache";
import { Request } from "express";

const cache = apicache.middleware("1 hour");

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
    apicache.clear("leaderboard");
}

function clearDailyCache() {
    apicache.clear("daily");
}

export { cache, setCache, clearGlobalCache, clearUserCache, clearDailyCache };