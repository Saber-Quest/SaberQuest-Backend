import type { Request, Response } from "express";
import { GET, PUT } from "../../router";
import db from "../../db";
import { User } from "../../models/user";
import { UserItem } from "../../models/userItem";

export class PlayerProfile {
    @GET("profile/:id")
    get(req: Request, res: Response) {
        db<User>("users")
            .select("*")
            .where("platform_id", req.params.id)
            .then((users) => {
                let user = users[0];
                if (!user) {
                    return res.status(404).json({ message: "User not found." });
                }

                const JsonResponse = {
                    userInfo: {
                        id: user.platform_id,
                        platform_id: user.platform_id,
                        username: user.username,
                        images: {
                            avatar: user.avatar,
                            banner: user.banner,
                            border: user.border,
                        },
                        preference: user.preference,
                    },
                    stats: {
                        rank: user.rank,
                        qp: user.qp,
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

    @GET("profile/:id/inventory")
    async getPlayerInventory(req: Request, res: Response) {
        const dbItems = db<UserItem>()
            .select("item_id")
            .where("user_id", req.params.id);

        res.status(200).json(JSON.stringify(dbItems));
    }

    @PUT("profile/create")
    async createUser(req: Request, res: Response) {
        const userData = req.body;
        await db<User>("users")
            .insert({
                platform_id: userData.platform_id,
                username: userData.username,
                avatar: userData.avatar,
                banner: null,
                border: null,
                preference: userData.preference,
                rank: userData.rank,
                qp: 0,
            })
            .then(() => {
                res.sendStatus(200);
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
