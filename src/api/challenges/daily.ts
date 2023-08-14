import { Request, Response } from "express";
import { ChallengeHistory } from "../../models/challengeHistory";
import { GET, POST } from "../../router";
import db from "../../db";

export class Daily {
    @GET("challenge/daily")
    async get(req: Request, res: Response) {
        const challenge = await db.select<ChallengeHistory>("challengeHistory").first();
        return res.json(challenge);
    }

    @POST("challenge/daily/new")
    async post(req: Request, res: Response) {
        const time = new Date().getDate();
        const date: Date = new Date(time / 1000);
        const isoTimestamp = date.toISOString();

        await db<ChallengeHistory>("challengeHistory")
            .insert({
                challenge: req.body.challenge,
                date: isoTimestamp,
            })
            .then(() => {
                res.status(200).send("Challenge created!!");
            })
            .catch(() => {
                console.error(
                    "An error occured. Yell at Storm to check out the error (most likely his fault xd"
                );
                res.status(500).json({
                    success: false,
                    message: `An error occured. Either try again later, or fix your body.`,
                });
            });
    }
}
