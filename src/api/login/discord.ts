import querystring from "querystring";
import { Request, Response } from "express";
import { GET } from "../../router";

export class DiscordLogin {
    @GET("link")
    async get(req: Request, res: Response) {
        const code = req.query.code.toString();

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
                redirect_uri: "https://saberquest.xyz/link-discord",
            }),
        })

        if (response.status !== 200) {
            return res.status(500).send("Failed to fetch the token");
        }

        const token = (await response.json()).access_token;

        const user = await fetch("https://discord.com/api/users/@me", {
            method: "GET",
            headers: {
                "authorization": `Bearer ${token}`,
            },
        });

        if (user.status !== 200) {
            return res.status(500).send("Error getting user.");
        }
    }
}