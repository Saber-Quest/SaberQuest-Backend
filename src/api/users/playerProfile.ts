import type { Request, Response } from "express";
import { GET, PUT } from "../../router";
import db from "../../db";
import { userRes } from "../../types/user";
import { User } from "../../models/user";

export class PlayerProfile {
    @GET("profile/:id")
    get(req: Request, res: Response) {
        db<User>("users")
            .select("*")
            .where("steam_id", req.params.steam_id)
            .first()
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: "User not found." });
                }
                const JsonResponse: userRes = {
                    userInfo: {
                        id: user.id,
                        steam_id: user.steam_id,
                        username: user.username,
                        images: {
                            avatar: user.avatar,
                            banner: user.banner,
                            border: user.border,
                        },
                        preference: user.preference,
                    },
                    challenge_history: [],
                    items: user.items,
                    stats: {
                        challengesCompleted: user.challenges_completed,
                        rank: user.rank,
                        qp: user.qp,
                        value: user.value,
                    },
                    today: {
                        diff: user.diff,
                        completed: user.completed,
                    },
                };
                return res.status(200).json(JsonResponse);
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "An error occurred, please try again later.",
                });
            });
    }

    @PUT("profile/create")
    async post(req: Request, res: Response) {
        const userData = req.body;
        await db<User>("users")
            .insert({
                id: userData.id,
                username: userData.username,
                avatar: userData.avatar,
                banner: null,
                border: null,
                preference: userData.preference,
                challenge_history: userData.challenge_history,
                items: [],
                challenges_completed: 0,
                rank: userData.rank,
                qp: 0,
                value: 0,
                diff: 4,
                completed: false,
            })
            .then(() => {
                res.status(200).send("User created!");
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: `An error occurred, did you include all the data?!`,
                });
            });
    }
}
