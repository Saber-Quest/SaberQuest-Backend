import { Request, Response } from "express";
import { GET } from "../../router";
import db from "../../db"

export class DailyChallenges {
    @GET("daily-challenges")
    get(req: Request, res: Response) {
        return res.json([]);
    }
}