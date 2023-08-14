import { Request, Response } from "express";
import { GET, POST } from "../../router";
import db from "../../db";
import { userRes } from "../../types/user";
import { User } from "../../models/user";
import { Item } from "../../models/item";

export class PlayerProfile {
    @GET("profile/:id")
    get(req: Request, res: Response) {
        db<User>("users")
            .select("*")
            .where("id", req.params.id)
            .first()
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: "User not found." });
                }

                const items  = user.items.map((item) => {
                    const json = JSON.parse(item.toString());
                    return {
                        id: json.id,
                        image: json.image,
                        name: json.name,
                        amount: json.amount
                    };
                });

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
                    items: items,
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
        const userData = req.body;
        await db<User>("users")
            .insert({
                id: userData.id,
                username: userData.username,
                avatar: userData.avatar,
                banner: null,
                border: null,
                preference: userData.preference,
                chistory: [],
                items: [],
                challengesCompleted: 0,
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
