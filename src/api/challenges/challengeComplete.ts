import { Request, Response } from 'express';
import { POST } from '../../router';
import db from '../../db';
import socketServer from '../../websocket';
import { verifyJWT } from '../../functions/users/jwtVerify';
import { User } from '../../models/user';
import Complete from '../../functions/challenges/complete';
import { ChallengeHistory } from '../../models/challengeHistory';

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
        const token = req.body.token;

        if (!token) {
            return res.status(400).json({ error: "Missing token" });
        }

        const decoded = verifyJWT(token);

        if (!decoded || decoded.exp < Date.now() / 1000) {
            return res.status(400).json({ error: "Invalid token" });
        }

        const challenge = await db<User>("users")
            .join("challenge_histories", "users.id", "=", "challenge_histories.user_id")
            .select("challenge_histories.*", "users.diff", "users.preference")
            .where("users.platform_id", decoded.id)
            .orderBy("date", "desc")
            .first();

        if (challenge.diff === 0 || challenge.diff === null) {
            return res.status(400).json({ error: "Missing difficulty" });
        }

        if (new Date(challenge.date).getUTCDay() === new Date().getUTCDay()) {
            return res.status(400).json({ error: "Challenge already completed today" });
        }

        const dailyChallenge = await db<ChallengeHistory>("challenge_histories")
            .join("challenge_sets", "challenge_histories.challenge_id", "=", "challenge_sets.id")
            .join("difficulties", "challenge_sets.id", "=", "difficulties.challenge_id")
            .select("challenge_sets.type", "challenge_sets.id", "difficulties.challenge", "difficulties.diff")
            .where("difficulties.diff", challenge.diff)
            .orderBy("date", "desc")
            .first();

        const complete = await Complete(dailyChallenge.type, dailyChallenge.challenge, challenge.preference, decoded.id, challenge.diff, challenge.challenge_id);

        if (complete === false) {
            return res.status(400).json({ error: "Challenge not completed" });
        }

        socketServer.emit("challengeCompleted", {
            id: decoded.id,
            diff: challenge.diff,
            rewards: complete
        });

        return res.status(200).json({ 
            message: "Challenge completed",
            rewards: complete
        });
    }
}