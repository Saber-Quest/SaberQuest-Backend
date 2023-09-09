import type { Request, Response } from "express";
import { ChallengeHistory } from "../../models/challengeHistory";
import { Difficulty } from "../../models/difficulty";
import { ChallengeSet } from "../../models/challengeSet";
import { GET, POST } from "../../router";
import db from "../../db";
import { ChallengeResponse } from "../../types/challenges";
import { cache, setCache } from "../../functions/cache";

enum DifficultyEnum {
    Normal = 1,
    Hard = 2,
    Expert = 3,
}

export class Daily {
    /**
     * GET /challenge/daily
     * @summary Get the daily challenge
     * @tags challenges
     * @return {object} 200 - Success
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * {
     * "name": "PP Challenge",
     * "description": "Get a certain amount of PP on a single map.",
     * "type": "pp",
     * "difficulties": {
     * "normal": {
     * "challenge": [50, 70],
     * "color": "#FFD941"
     * },
     * "hard": {
     * "challenge": [200, 250],
     * "color": "#E93B3B"
     * },
     * "expert": {
     * "challenge": [400, 500],
     * "color": "#B74BF5"
     * }
     * },
     * "image": null,
     * "reset_time": 1694341697190
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @GET("challenge/daily", cache)
    async get(req: Request, res: Response) {
        const challenge = await db<ChallengeHistory>("challenge_histories")
            .select("challenge_id", "date")
            .orderBy("date", "desc")
            .first();

        const challengeSet = await db<ChallengeSet>("challenge_sets")
            .select("*")
            .where("id", challenge.challenge_id)
            .first();

        const difficulties = await db<Difficulty>("difficulties")
            .select("diff", "challenge", "color")
            .where("challenge_id", challenge.challenge_id);

        const normal = difficulties.find(
            (difficulty) => difficulty.diff === DifficultyEnum.Normal
        );
        const hard = difficulties.find(
            (difficulty) => difficulty.diff === DifficultyEnum.Hard
        );
        const expert = difficulties.find(
            (difficulty) => difficulty.diff === DifficultyEnum.Expert
        );

        const response: ChallengeResponse = {
            name: challengeSet.name,
            description: challengeSet.description,
            type: challengeSet.type,
            difficulties: {
                normal: {
                    challenge: normal.challenge,
                    color: normal.color,
                },
                hard: {
                    challenge: hard.challenge,
                    color: hard.color,
                },
                expert: {
                    challenge: expert.challenge,
                    color: expert.color,
                }
            },
            image: challengeSet.image,
            reset_time: new Date(challenge.date).getTime() + 86400000,
        };

        setCache(req, "daily");

        res.status(200).json(response);
    }
}
