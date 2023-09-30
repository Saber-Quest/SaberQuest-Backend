import querystring from "querystring";
import { Request, Response } from "express";
import { GET } from "../../router";
import db from "../../db";
import { User } from "../../models/user";
import { createRandomState } from "../../functions/random";
import { verifyJWT } from "../../functions/users/jwtVerify";

const activeStates: string[] = [];

export class PatreonLogin {
    @GET("link/patreon")
    async get(req: Request, res: Response): Promise<void | Response> {
    //    try {
    //        const jwt = req.cookies.token;
//
    //        if (!jwt) {
    //            return res.status(401).send("Invalid JWT");
    //        }
//
    //        const decoded = verifyJWT(jwt);
//
    //        if (!decoded || decoded.exp < Date.now() / 1000) {
    //            return res.status(401).send("Invalid JWT");
    //        }
//
    //        const user = await db<User>("users")
    //            .select("*")
    //            .where("platform_id", decoded.id)
    //            .first();
//
    //        if (!user) {
    //            return res.status(404).send("User not found");
    //        }
//
    //        if (!req.query.state) {
//
    //            const state = createRandomState();
//
    //            activeStates.push(state);
//
    //            setTimeout(() => {
    //                activeStates.splice(activeStates.indexOf(state), 1);
    //            }, 1000 * 60 * 5);
//
    //            return res.redirect(`https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.PATREON_ID}&redirect_uri=${process.env.REDIRECT_URI_API}/link/patreon&state=${state}`);
    //        }
//
    //        else {
    //            if (!activeStates.includes(req.query.state.toString())) {
    //                return res.status(400).send("Invalid state");
    //            }
//
    //            const code = req.query.code.toString();
//
    //            if (!code) {
    //                return res.status(400).send("No code provided");
    //            }
//
    //            const response = await fetch("https://www.patreon.com/api/oauth2/token", {
    //                method: "POST",
    //                headers: {
    //                    "Content-Type": "application/x-www-form-urlencoded",
    //                },
    //                body: querystring.stringify({
    //                    grant_type: "authorization_code",
    //                    code: code,
    //                    client_secret: process.env.PATREON_SECRET,
    //                    client_id: process.env.PATREON_ID,
    //                    redirect_uri: `${process.env.REDIRECT_URI_API}/link/patreon`,
    //                }),
    //            });
//
    //            if (response.status !== 200) {
    //                return res.status(500).send("Failed to fetch the token");
    //            }
//
    //            const token = (await response.json()).access_token;
//
    //            const user = await fetch("https://www.patreon.com/api/oauth2/v2/identity?include=memberships", {
    //                method: "GET",
    //                headers: {
    //                    authorization: `Bearer ${token}`,
    //                },
    //            });
//
    //            if (user.status !== 200) {
    //                return res.status(500).send("Error getting user.");
    //            }
//
    //            const userData = await user.json();
//
    //            for (const membership of userData.data.relationships.memberships.data) {
    //            }
    //        }
//
    //    } catch (e) {
    //        console.error(e);
    //        return res.sendStatus(500);
    //    }
    }
}