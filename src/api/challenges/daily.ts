import type { Request, Response } from "express";
import { ChallengeHistory } from "../../models/challengeHistory";
import { Difficulty } from "../../models/difficulty";
import { ChallengeSet } from "../../models/challengeSet";
import { GET, POST } from "../../router";
import db from "../../db";
import { ChallengeResponse, ChallengeModResponse } from "../../types/challenges";
import { cache, setCache } from "../../functions/cache";

enum DifficultyEnum {
    Normal = 1,
    Hard = 2,
    Expert = 3,
}

function formatMod(type: string, challenge: number[]) {
    if (type === "map" || type === "fcnotes" || type === "passnotes") {
        return `<line-height=70%><color=#FFAAAA>${challenge[0]}`;
    }

    else if (type === "xaccuracystars") {
        return `<line-height=70%><color=#FFAAAA>BL: ${challenge[1]} stars<br><color=#FFFF55>SS: ${challenge[0]} stars<br><color=#5555FF>ACC: ${challenge[2]}%`;
    }

    else if (type === "xaccuracypp") {
        return `<line-height=70%><color=#FFAAAA>BL: ${challenge[1]} PP<br><color=#FFFF55>SS: ${challenge[0]} PP<br><color=#5555FF>ACC: ${challenge[2]}%`;
    }

    else if (type === "xaccuracynotes") {
        return `<line-height=70%><color=#FFAAAA>${challenge[0]} notes<br>ACC: ${challenge[1]}%`;
    }

    else if (type === "pp") {
        return `<line-height=70%><color=#FFAAAA>BL: ${challenge[1]} PP<br><color=#FFFF55>SS: ${challenge[0]} PP`;
    }

    else if (type === "fcstars") {
        return `<line-height=70%><color=#FFAAAA>BL: ${challenge[1]} stars<br><color=#FFFF55>SS: ${challenge[0]} stars`;
    }
}

export class Daily {
    /**
     * GET /challenge/daily
     * @summary Get the daily challenge
     * @tags Challenges
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
        res.setHeader("Access-Control-Allow-Origin", "*");
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

    /**
     * GET /challenge/all
     * @summary Get all challenges
     * @tags Challenges
     * @return {object} 200 - Success
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * {
     *  "challenges": [
     *   {
     *   "name": "PP Challenge",
     *  "description": "Get a certain amount of PP on a single map.",
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
     * "reset_time": null
     * }
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */

    @GET("challenge/all", cache)
    async getAll(req: Request, res: Response) {
        res.setHeader("Access-Control-Allow-Origin", "*");

        try {

            const challenges = await db<ChallengeSet>("challenge_sets")
                .select("*");

            const response: ChallengeResponse[] = [];

            for (const challenge of challenges) {
                const difficulties = await db<Difficulty>("difficulties")
                    .select("diff", "challenge", "color")
                    .where("challenge_id", challenge.id);

                const normal = difficulties.find(
                    (difficulty) => difficulty.diff === DifficultyEnum.Normal
                );
                const hard = difficulties.find(
                    (difficulty) => difficulty.diff === DifficultyEnum.Hard
                );
                const expert = difficulties.find(
                    (difficulty) => difficulty.diff === DifficultyEnum.Expert
                );

                response.push({
                    name: challenge.name,
                    description: challenge.description,
                    type: challenge.type,
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
                    image: challenge.image,
                    reset_time: null
                });
            }

            res.status(200).send({ challenges: response });
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }

    /**
     * GET /challenge/daily/mod
     * @summary Get the daily challenge but formatted for the mod
     * @tags Challenges
     * @return {object} 200 - Success
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     *{
     *    "name": "Play X Maps Challenge",
     *    "description": "Play a certain amount of maps.",
     *    "type": "map",
     *    "difficulties": [
     *        {
     *            "name": "Normal",
     *            "challenge": "<line-height=70%><color=#FFAAAA>3",
     *            "color": "#FFD941"
     *        },
     *        {
     *            "name": "Hard",
     *            "challenge": "<line-height=70%><color=#FFAAAA>8",
     *            "color": "#E93B3B"
     *        },
     *        {
     *            "name": "Expert",
     *            "challenge": "<line-height=70%><color=#FFAAAA>15",
     *            "color": "#B74BF5"
     *        }
     *    ],
     *    "image": null,
     *    "reset_time": 1694455212962
     *}
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @GET("challenge/daily/mod")
    async getMod(req: Request, res: Response) {
        res.setHeader("Access-Control-Allow-Origin", "*");
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

        const response: ChallengeModResponse = {
            name: challengeSet.name,
            description: challengeSet.description,
            type: challengeSet.type,
            difficulties: [
                {
                    name: "Normal",
                    challenge: formatMod(challengeSet.type, normal.challenge),
                    color: normal.color,
                },
                {
                    name: "Hard",
                    challenge: formatMod(challengeSet.type, hard.challenge),
                    color: hard.color,
                },
                {
                    name: "Expert",
                    challenge: formatMod(challengeSet.type, expert.challenge),
                    color: expert.color,
                }
            ],
            image: challengeSet.image,
            reset_time: new Date(challenge.date).getTime() + 86400000,
        };

        setCache(req, "daily");

        res.status(200).json(response);
    }
}
