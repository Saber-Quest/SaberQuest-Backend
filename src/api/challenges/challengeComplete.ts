import { Request, Response } from 'express';
import { POST } from '../../router';
import db from '../../db';
import socketServer from '../../websocket';
import { verifyJWT } from '../../functions/users/jwtVerify';
import { User } from '../../models/user';
import Complete from '../../functions/challenges/complete';
import { ChallengeHistory } from '../../models/challengeHistory';
import { Difficulty } from '../../models/difficulty';

export class ChallengeComplete {
    /** 
     * Token
     * @typedef {object} Token
     * @property {string} token.required - The user's JWT token
     */

    /**
     * POST /challenge/complete
     * @summary Complete a challenge
     * @tags Challenges
     * @security JWT
     * @param {Token} request.body.required - The user's JWT token
     * @return {object} 200 - Success
     * @return {string} 400 - Missing token
     * @return {string} 400 - Invalid token
     * @return {string} 400 - Missing difficulty
     * @return {string} 400 - Challenge already completed today
     * @return {string} 400 - Challenge not completed
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     *{
     *    "message": "Challenge completed",
     *    "rewards": {
     *        "qp": 11,
     *        "items": [
     *            {
     *                "id": "sp",
     *                "rarity": "Epic",
     *                "value": 3
     *            }
     *        ],
     *        "value": 3
     *    }
     *}
     * @example response - 400 - Missing token
     * {
     *    "error": "Missing token"
     * }
     * @example response - 400 - Invalid token
     * {
     *   "error": "Invalid token"
     * }
     * @example response - 400 - Missing difficulty
     * {
     *  "error": "Missing difficulty"
     * }
     * @example response - 400 - Challenge already completed today
     * {
     * "error": "Challenge already completed today"
     * }
     * @example response - 400 - Challenge not completed
     * {
     * "error": "Challenge not completed"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @POST("challenge/complete")
    async post(req: Request, res: Response) {
        try {
            const token = req.body.token;

            if (!token) {
                return res.status(400).json({ error: "Missing token" });
            }

            const decoded = verifyJWT(token);

            if (!decoded || decoded.exp < Date.now() / 1000) {
                return res.status(400).json({ error: "Invalid token" });
            }

            const user = await db<User>("users")
                .select("diff", "preference", "id")
                .where("platform_id", decoded.id)
                .first();

            const challenge = await db<ChallengeHistory>("challenge_histories")
                .where("user_id", user.id)
                .orderBy("date", "desc")
                .first();

            if (user.diff === 0 || user.diff === null) {
                return res.status(400).json({ error: "Missing difficulty" });
            }

            if (challenge) {
                if (new Date(challenge.date).getUTCDay() === new Date().getUTCDay() && new Date(challenge.date).getUTCFullYear() === new Date().getUTCFullYear() && new Date(challenge.date).getUTCMonth() === new Date().getUTCMonth()) {
                    return res.status(400).json({ error: "Challenge already completed today" });
                }
            }

            const challengeToday = await db<ChallengeHistory>("challenge_histories")
                .select("challenge_id")
                .orderBy("date", "desc")
                .first();

            const diffChallenge = await db<Difficulty>("difficulties")
                .join("challenge_sets", "difficulties.challenge_id", "=", "challenge_sets.id")
                .select("challenge_sets.type", "difficulties.challenge")
                .where("difficulties.diff", user.diff)
                .andWhere("difficulties.challenge_id", challengeToday.challenge_id)
                .first();

            const complete = await Complete(diffChallenge.type, diffChallenge.challenge, user.preference, decoded.id, user.diff, challengeToday.challenge_id);

            if (complete === false) {
                return res.status(400).json({ error: "Challenge not completed" });
            }

            socketServer.emit("challengeCompleted", {
                id: decoded.id,
                diff: user.diff,
                rewards: complete
            });

            return res.status(200).json({
                message: "Challenge completed",
                rewards: complete
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send("Internal server error");
        }
    }
}