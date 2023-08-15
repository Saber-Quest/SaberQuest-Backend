import type { Request, Response } from "express";
import { ChallengeHistory } from "../../models/challengeHistory";
import { GET, POST } from "../../router";
import db from "../../db";

export class Daily {
    @GET("challenge/daily")
    async get(req: Request, res: Response) {
        const challenge = await db.select<ChallengeHistory>("challenge_history").first();
        return res.json(challenge);
    }

    @POST("challenge/daily/new")
    async post(req: Request, res: Response) {
       await db<ChallengeHistory>("challenge_history")
            .insert({
                challenges: req.body.challenge,
                date: new Date(),
            })
            .then(() => {
                res.status(200).send("Challenge created!!");
            })
            .catch(() => {
                console.error(
                    "An error occured. Yell at Storm to check out the error (most likely his fault xd)"
                );
                res.status(500).json({
                    success: false,
                    message: `An error occured. Either try again later, or fix your body.`,
                });
            });
    }
}
