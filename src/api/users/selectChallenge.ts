import { PATCH } from "../../router";
import db from "../../db";
import { Request, Response } from "express";
import { verifyJWT } from "../../functions/users/jwtVerify";

export class SelectChallenge {
    /**
     * Select challenge
     * @typedef {object} SelectChallenge
     * @property {number} challenge.required - The challenge to select
     * @property {string} token.required - The user's JWT token
     */

    /**
     * PATCH /profile/select
     * @summary Select a challenge
     * @tags Profile
     * @security JWT
     * @param {SelectChallenge} request.body.required - The challenge to select
     * @return {object} 200 - Success
     * @return {object} 400 - Missing fields
     * @return {object} 400 - Invalid challenge
     * @return {object} 404 - User not found
     * @return {object} 401 - Token expired
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * {
     * "message": "Success"
     * }
     * @example response - 400 - Missing fields
     * {
     * "error": "Missing fields"
     * }
     * @example response - 400 - Invalid challenge
     * {
     * "error": "Invalid challenge"
     * }
     * @example response - 404 - User not found
     * {
     * "error": "User not found"
     * }
     * @example response - 401 - Token expired
     * {
     * "error": "Token expired"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @PATCH("profile/select")
    async patch(req: Request, res: Response) {
        try {
            const jwt = verifyJWT(req.body.token);
            const challengeNum = Number(req.body.challenge);

            if (jwt.exp < Date.now() / 1000) {
                return res.status(401).json({ error: "Token expired" });
            }

            if (isNaN(challengeNum)) {
                return res.status(400).json({ error: "Invalid challenge" });
            }

            const user = await db("users")
                .select("id", "platform_id")
                .where("platform_id", jwt.id)
                .update({ challenge: challengeNum })
                .first();

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.status(200).json({ message: "Success" });
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
}