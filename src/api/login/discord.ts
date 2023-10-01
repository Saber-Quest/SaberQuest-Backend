import querystring from "querystring";
import type { Request, Response } from "express";
import { GET } from "../../router";
import db from "../../db";
import { User } from "../../models/user";
import { verifyJWT } from "../../functions/users/jwtVerify";
import socketServer from "../../websocket";
export class DiscordLogin {
    /**
     * GET /link/discord
     * @summary Link your Discord account
     * @tags Login
     * @param {string} code.query.required - The code returned from Discord
     * @return {string} 200 - Success
     * @return {string} 400 - No code provided
     * @return {string} 400 - Your Discord account is already linked to a user.
     * @return {string} 401 - Invalid JWT
     * @return {string} 404 - User not found
     * @return {string} 500 - Failed to fetch the token
     * @return {string} 500 - Error getting user.
     * @example response - 200 - Success
     * "Successfully linked your Discord account.\nYou will be redirected back to the website shortly."
     * @example response - 400 - No code provided
     * "No code provided"
     * @example response - 400 - Your Discord account is already linked to a user.
     * "Your Discord account is already linked to a user."
     * @example response - 401 - Invalid JWT
     * "Invalid JWT"
     * @example response - 404 - User not found
     * "User not found"
     * @example response - 500 - Failed to fetch the token
     * "Failed to fetch the token"
     * @example response - 500 - Error getting user.
     * "Error getting user."
     */
    @GET("link/discord")
    async get(req: Request, res: Response): Promise<void | Response> {
        try {
            const code = req.query.code.toString();
            const jwt = req.cookies.token

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
                    redirect_uri: `${process.env.REDIRECT_URI_API}/link/discord`,
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

                if (!jwtData || jwtData.exp < Date.now() / 1000) {
                    return res.status(401).send("Invalid JWT");
                }

                const user = await db<User>("users").where("platform_id", jwtData.id).first();

                if (!user) {
                    return res.status(404).send("User not found");
                }

                await db<User>("users").where("id", user.id).update({
                    discord_id: String(userData.id)
                });

                socketServer.emit("discord", {
                    id: user.id,
                    discord_id: String(userData.id)
                });

                res.status(200).send("<p>Successfully linked your Discord account.</p><p>You will be redirected back to the website shortly.</p><script>setTimeout(() => { window.location.href = '" + process.env.REDIRECT_URI + "'; }, 5000);</script>");
            } else {
                res.status(400).send("Your Discord account is already linked to a user.");
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send("Error getting user.");
        }
    }
}
