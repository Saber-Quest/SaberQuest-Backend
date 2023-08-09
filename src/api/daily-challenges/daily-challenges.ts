import { Request, Response } from "express";
import { GET } from "../../router";

export class DailyChallenges {
    @GET("daily-challenges")
    get(req: Request, res: Response) {
        return res.json([]);
    }
}