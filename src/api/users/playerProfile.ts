import { Request, Response } from "express";
import { GET, POST } from "../../router";
import db from "../../db";
import { userRes } from "../../types/user";
import { User } from "../../models/user";

export class PlayerProfile {
    @GET("profile/:id")
    get(req: Request, res: Response) {
        db("users")
            .select("*")
            .where("id", req.params.id)
            .then((users) => {
                const user = users[0];
                if (!user) {
                    return res.status(404).json({ message: "User not found." });
                }
                const JsonResponse: userRes = {
                    userInfo: {
                        id: user.id,
                        username: user.username,
                        images: {
                            avatar: user.avatar,
                            banner: user.banner,
                            border: user.border,
                        },
                        preference: user.preference,
                    },
                    chistory: user.chistory,
                    items: user.items,
                    stats: {
                        challengesCompleted: user.challengesCompleted,
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

    @POST("profile/create")
    async post(req: Request, res: Response) {
        console.log(req);
        console.log(req.body);
        const userData = req.body;
        console.log(userData);
        await db
            .select<User>()
            .insert({
                id: userData.id,
                username: userData.username,
                images: {
                    avatar: userData.avatar,
                    banner: null,
                    border: null,
                },
                preference: userData.preference,
                chistory: {},
                items: {},
                challengesComplete: 0,
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
                    message: `An error occurred, did you include all the data?`,
                });
            });
    }
}