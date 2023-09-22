import { GET } from "../../router";
import { User } from "../../models/user";
import { Request, Response } from "express";
import db from "../../db";

export class Search {
    /**
     * GET search
     * @summary Search for a user
     * @tags Users
     * @param {string} q.query.required - The search query
     * @return {object} 200 - Success
     * @return {object} 400 - Missing fields
     * @return {object} 500 - Internal server error
     * @example response - 200 - Success
     * [
     * {
     * "username": "StormPacer",
     * "id": "76561198343533017",
     * "rank": 2,
     * "value": 32
     * }
     * ]
     * @example response - 400 - Missing fields
     * {
     * "error": "Missing fields"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @GET("search")
    async get(req: Request, res: Response) {
        try {
            const search = req.query.q as string;

            if (!search) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const users = await db<User>("users")
                .select("username", "platform_id", "rank", "value")
                .where("username", "ilike", `%${search}%`)
                .orWhere("platform_id", "ilike", `%${search}%`)

            const response: { username: string, id: string, rank: number, value: number }[] = [];

            users.forEach(user => {
                response.push({
                    username: user.username,
                    id: user.platform_id,
                    rank: user.rank,
                    value: user.value
                });
            });

            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
}