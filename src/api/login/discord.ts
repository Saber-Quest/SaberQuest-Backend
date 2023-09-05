import querystring from "querystring";
import type { Request, Response } from "express";
import { GET } from "../../router";
import db from "../../db";
import { User } from "../../models/user";
import { verifyJWT } from "../../functions/jwtVerify";
export class DiscordLogin {
    /**
     * GET /link
     * @summary Link your Discord account
     * @tags login
     */
    @GET("link")
    async get(req: Request, res: Response): Promise<void | Response> {
        try {
            const code = req.query.code.toString();
            const jwt = req.cookies.token;

            if (!code) {
                return res.status(400).send("No code provided");
            }

            const response = await fetch("https://discord.com/api/oauth2/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: querystring.stringify({
                    grant_type: "authorization_code",
                    code: code,
                    client_secret: process.env.DISCORD_SECRET,
                    client_id: process.env.DISCORD_ID,
                    redirect_uri: `${process.env.REDIRECT_URI_API}/link`,
                }),
            });

            if (response.status !== 200) {
                return res.status(500).send("Failed to fetch the token");
            }

            const token = (await response.json()).access_token;

            const user = await fetch("https://discord.com/api/users/@me", {
                method: "GET",
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            if (user.status !== 200) {
                return res.status(500).send("Error getting user.");
            }

            const userData = await user.json();

            const dbUser = await db<User>("users").where("discord_id", userData.id).first();

            if (!dbUser) {
                const jwtData = verifyJWT(jwt);

                if (!jwtData || jwtData.exp < Date.now()) {
                    return res.status(401).send("Invalid JWT");
                }

                const user = await db<User>("users").where("id", jwtData.id).first();

                if (!user) {
                    return res.status(404).send("User not found");
                }

                await db<User>("users").where("id", user.id).update({
                    discord_id: String(userData.id)
                });

                res.status(200).send("Successfully linked your Discord account.\nYou will be redirected back to the website shortly.");

                setTimeout(() => {
                    res.redirect(process.env.REDIRECT_URI);
                }, 5000);
            } else {
                res.status(400).send("Your Discord account is already linked to a user.");
            }
        } catch (err) {
            return res.status(500).send("Error getting user.");
        }
    }
}
