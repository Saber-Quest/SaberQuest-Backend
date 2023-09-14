import querystring from "querystring";
import type { Request, Response } from "express";
import { GET } from "../../router";
import { User } from "../../models/user";
import db from "../../db";
import { compareAvatars, downloadAvatar, createBuffer } from "../../functions/users/avatar";
import { createRandomState, createRandomToken } from "../../functions/random";
import jwt from "jsonwebtoken";
import socketServer from "../../websocket";

const activeStates: string[] = [];
const activeTokens: string[] = [];

export class BeatLeaderLogin {
    /**
     * GET /login
     * @summary Login with BeatLeader/Steam
     * @tags Login
     * @param {string} id.query.required - The id of the user
     * @return {object} 400 - No id provided
     * @return {object} 401 - No token provided
     * @return {object} 401 - Invalid token
     * @return {object} 401 - User does not exist in any of the databases.
     * @return {object} 500 - Error getting user
     * @example response - 400 - No id provided
     * {
     * "message": "No id provided"
     * }
     * @example response - 401 - No token provided
     * {
     * "message": "No token provided"
     * }
     * @example response - 401 - Invalid token
     * {
     * "message": "Invalid token"
     * }
     * @example response - 401 - User does not exist in any of the databases.
     * {
     * "message": "User does not exist in any of the databases."
     * }
     * @example response - 500 - Error getting user
     * {
     * "message": "Error getting user"
     * }
     */
    @GET("login")
    async getLogin(req: Request, res: Response) {
        const id = req.query.id;
        const token = req.cookies.auth;

        if (!token) {
            return res.status(401).send("No token provided");
        }

        if (!activeTokens.includes(token)) {
            return res.status(401).send("Invalid token");
        }

        if (!id) {
            return res.status(400).send("No id provided");
        }

        const user = await db<User>("users").where("platform_id", id).first();

        if (!user) {
            let hasBl = false;
            let hasSs = false;
            let username: string = "";
            let avatar: string = "";

            const beatleader = await fetch(`https://api.beatleader.xyz/player/${id}`).then((res) => res.json());
            if (beatleader.id !== null) {
                hasBl = true;
            }
            const scoresaber = await fetch(`https://scoresaber.com/api/player/${id}/basic`).then((res) => res.json());
            if (!scoresaber.errorMessage) {
                hasSs = true;
            }

            let preference: string | undefined;

            if (hasBl) {
                preference = "bl";
                avatar = beatleader.avatar;
                username = beatleader.name;
            } else if (hasSs) {
                preference = "ss";
                avatar = scoresaber.profilePicture;
                username = scoresaber.name;
            } else {
                preference = undefined;
            }

            if (preference === undefined) {
                return res.status(401).json({
                    message: "User does not exist in any of the databases."
                });
            }

            const buffer = await createBuffer(avatar);
            downloadAvatar(buffer, id.toString());

            const rank = await db<User>("users").count("id").then((res) => Number(res[0].count) + 1);

            await fetch(`${process.env.REDIRECT_URI_API}/profile/create`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    authorization_code: process.env.AUTHORIZATION_CODE,
                    platform_id: id,
                    username: username,
                    avatar: `${process.env.REDIRECT_URI_API}/profile/${id}/avatar`,
                    preference: preference,
                    rank: rank
                })
            }).then((response) => {
                if (response.status === 200) {
                    const token = jwt.sign({
                        id: id
                    }, process.env.JWT_SECRET, {
                        expiresIn: "30d"
                    });

                    socketServer.emit("newUser", {
                        id: id,
                        username: username
                    });

                    return res.redirect(`${process.env.REDIRECT_URI}/login?token=${token}`);
                }

                return res.sendStatus(500);
            });
        }

        if (user.patreon === false) {
            if (user.preference === "bl") {
                const beatleader = await fetch(`https://api.beatleader.xyz/player/${id}`).then((res) => res.json());
                compareAvatars(beatleader.avatar, id.toString());
            } else if (user.preference === "ss") {
                const scoresaber = await fetch(`https://scoresaber.com/api/player/${id}/basic`).then((res) => res.json());
                compareAvatars(scoresaber.profilePicture, id.toString());
            }
        }

        const jwtToken = jwt.sign({
            id: id
        }, process.env.JWT_SECRET, {
            expiresIn: "30d"
        });

        return res.redirect(`${process.env.REDIRECT_URI}/login?token=${jwtToken}`);
    }

    /**
     * GET /login/beatleader
     * @summary Login with BeatLeader
     * @tags Login
     * @param {string} code.query.required - The code provided by BeatLeader
     * @param {string} iss.query.required - The issuer of the code
     * @return {object} 400 - No code provided
     * @return {object} 403 - Invalid issuer
     * @return {object} 500 - Error getting user
     * @example response - 400 - No code provided
     * {
     * "message": "No code provided"
     * }
     * @example response - 403 - Invalid issuer
     * {
     * "message": "Invalid issuer"
     * }
     * @example response - 500 - Error getting user
     * {
     * "message": "Error getting user"
     * }
     */
    @GET("login/beatleader")
    async get(req: Request, res: Response) {
        const code = req.query.code;
        const iss = req.query.iss;

        if (iss !== "https://api.beatleader.xyz/") {
            return res.status(403).send("Invalid issuer");
        }

        if (!code) {
            return res.status(400).send("No code provided");
        }

        const response = await fetch(
            "https://api.beatleader.xyz/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: querystring.stringify({
                    grant_type: "authorization_code",
                    code: code.toString(),
                    client_secret: process.env.BEATLEADER_SECRET,
                    client_id: process.env.BEATLEADER_ID,
                    redirect_uri: `${process.env.REDIRECT_URI_API}/login/beatleader`,
                }),
            }
        ).then((res) => res.json());

        const token = response.access_token;

        const user = await fetch("https://api.beatleader.xyz/oauth2/identity", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (user.status !== 200) {
            return res.status(500).send("Error getting user");
        }

        const userJson = await user.json();

        const id = userJson.id;

        const authToken = createRandomToken();

        res.cookie("auth", authToken, {
            maxAge: 5000
        });

        activeTokens.push(authToken);

        setTimeout(() => {
            const index = activeTokens.indexOf(authToken);
            if (index > -1) {
                activeTokens.splice(index, 1);
            }
        }, 5000);

        return res.redirect(`${process.env.REDIRECT_URI_API}/login?id=${id}&iss=https://api.saberquest.xyz`);
    }

    /**
     * GET /login/steam
     * @summary Login with Steam
     * @tags Login
     * @param {string} openid.identity.query.required - The id of the user
     * @param {string} state.query.required - The state of the login
     * @return {object} 401 - Invalid state
     * @return {object} 500 - Error getting user
     * @example response - 401 - Invalid state
     * {
     * "message": "Invalid state"
     * }
     * @example response - 500 - Error getting user
     * {
     * "message": "Error getting user"
     * }
     */
    @GET("login/steam")
    async getSteamLogin(req: Request, res: Response): Promise<void | Response> {
        if (!req.query.state) {
            const state = createRandomState();
            activeStates.push(state);
            setTimeout(() => {
                const index = activeStates.indexOf(state);
                if (index > -1) {
                    activeStates.splice(index, 1);
                }
            }, 1000 * 60 * 60);
            return res.redirect(`https://steamcommunity.com/openid/login?openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.realm=http%3A%2F%2Flocalhost:3010&openid.return_to=http%3A%2F%2Flocalhost:3010%2Flogin/steam%3Fstate=${state}&openid.ns.ax=http%3A%2F%2Fopenid.net%2Fsrv%2Fax%2F1.0&openid.ax.mode=fetch_request&openid.ax.type.email=http%3A%2F%2Faxschema.org%2Fcontact%2Femail&openid.ax.type.name=http%3A%2F%2Faxschema.org%2FnamePerson&openid.ax.type.first=http%3A%2F%2Faxschema.org%2FnamePerson%2Ffirst&openid.ax.type.last=http%3A%2F%2Faxschema.org%2FnamePerson%2Flast&openid.ax.type.email2=http%3A%2F%2Fschema.openid.net%2Fcontact%2Femail&openid.ax.type.name2=http%3A%2F%2Fschema.openid.net%2FnamePerson&openid.ax.type.first2=http%3A%2F%2Fschema.openid.net%2FnamePerson%2Ffirst&openid.ax.type.last2=http%3A%2F%2Fschema.openid.net%2FnamePerson%2Flast&openid.ax.required=email,name,first,last,email2,name2,first2,last2`);
        }

        const identity = req.query["openid.identity"];
        const state = req.query.state.toString();
        if (!activeStates.includes(state)) {
            return res.sendStatus(401);
        }

        const id = identity.toString().split("/").pop();
        if (!id) {
            return res.status(500).send({
                message: "Error getting user"
            });
        }

        const authToken = createRandomToken();
        res.cookie("auth", authToken, {
            maxAge: 5000
        });

        activeTokens.push(authToken);
        setTimeout(() => {
            const index = activeTokens.indexOf(authToken);
            if (index > -1) {
                activeTokens.splice(index, 1);
            }
        }, 5000);

        return res.redirect(`${process.env.REDIRECT_URI_API}/login?id=${id}&iss=https://api.saberquest.xyz`);
    }

        /**
     * GET /login/mod/beatleader
     * @summary Login with BeatLeader but for the mod!
     * @tags Login
     * @param {string} code.query.required - The code provided by BeatLeader
     * @param {string} iss.query.required - The issuer of the code
     * @return {object} 400 - No code provided
     * @return {object} 403 - Invalid issuer
     * @return {object} 500 - Error getting user
     * @example response - 400 - No code provided
     * {
     * "message": "No code provided"
     * }
     * @example response - 403 - Invalid issuer
     * {
     * "message": "Invalid issuer"
     * }
     * @example response - 500 - Error getting user
     * {
     * "message": "Error getting user"
     * }
     */
    @GET("login/mod/beatleader")
    async getMod(req: Request, res: Response) {
        const code = req.query.code;
        const iss = req.query.iss;

        if (iss !== "https://api.beatleader.xyz/") {
            return res.status(403).send("Invalid issuer");
        }

        if (!code) {
            return res.status(400).send("No code provided");
        }

        const response = await fetch(
            "https://api.beatleader.xyz/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: querystring.stringify({
                    grant_type: "authorization_code",
                    code: code.toString(),
                    client_secret: process.env.BEATLEADER_SECRET,
                    client_id: process.env.BEATLEADER_ID,
                    redirect_uri: `${process.env.REDIRECT_URI_API}/login/beatleader`,
                }),
            }
        ).then((res) => res.json());

        const token = response.access_token;

        const user = await fetch("https://api.beatleader.xyz/oauth2/identity", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (user.status !== 200) {
            return res.status(500).send("Error getting user");
        }

        const userJson = await user.json();

        const id = userJson.id;

        const authToken = createRandomToken();

        res.cookie("auth", authToken, {
            maxAge: 5000
        });

        activeTokens.push(authToken);

        setTimeout(() => {
            const index = activeTokens.indexOf(authToken);
            if (index > -1) {
                activeTokens.splice(index, 1);
            }
        }, 5000);

        return res.redirect(`${process.env.REDIRECT_URI_API}/login/mod/middleman?id=${id}&iss=https://api.saberquest.xyz`);
    }

        /**
     * GET /login/mod/middleman
     * @summary Login with BeatLeader/Steam but for the mod!
     * @tags Login
     * @param {string} id.query.required - The id of the user
     * @return {object} 400 - No id provided
     * @return {object} 401 - No token provided
     * @return {object} 401 - Invalid token
     * @return {object} 401 - User does not exist in any of the databases.
     * @return {object} 500 - Error getting user
     * @example response - 400 - No id provided
     * {
     * "message": "No id provided"
     * }
     * @example response - 401 - No token provided
     * {
     * "message": "No token provided"
     * }
     * @example response - 401 - Invalid token
     * {
     * "message": "Invalid token"
     * }
     * @example response - 401 - User does not exist in any of the databases.
     * {
     * "message": "User does not exist in any of the databases."
     * }
     * @example response - 500 - Error getting user
     * {
     * "message": "Error getting user"
     * }
     */
    @GET("login/mod/middleman")
    async getModLogin(req: Request, res: Response) {
        const id = req.query.id;
        const token = req.cookies.auth;

        if (!token) {
            return res.status(401).send("No token provided");
        }

        if (!activeTokens.includes(token)) {
            return res.status(401).send("Invalid token");
        }

        if (!id) {
            return res.status(400).send("No id provided");
        }

        const user = await db<User>("users").where("platform_id", id).first();

        if (!user) {
            let hasBl = false;
            let hasSs = false;
            let username: string = "";
            let avatar: string = "";

            const beatleader = await fetch(`https://api.beatleader.xyz/player/${id}`).then((res) => res.json());
            if (beatleader.id !== null) {
                hasBl = true;
            }
            const scoresaber = await fetch(`https://scoresaber.com/api/player/${id}/basic`).then((res) => res.json());
            if (!scoresaber.errorMessage) {
                hasSs = true;
            }

            let preference: string | undefined;

            if (hasBl) {
                preference = "bl";
                avatar = beatleader.avatar;
                username = beatleader.name;
            } else if (hasSs) {
                preference = "ss";
                avatar = scoresaber.profilePicture;
                username = scoresaber.name;
            } else {
                preference = undefined;
            }

            if (preference === undefined) {
                return res.status(401).json({
                    message: "User does not exist in any of the databases."
                });
            }

            const buffer = await createBuffer(avatar);
            downloadAvatar(buffer, id.toString());

            const rank = await db<User>("users").count("id").then((res) => Number(res[0].count) + 1);

            await fetch(`${process.env.REDIRECT_URI_API}/profile/create`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    authorization_code: process.env.AUTHORIZATION_CODE,
                    platform_id: id,
                    username: username,
                    avatar: `${process.env.REDIRECT_URI_API}/profile/${id}/avatar`,
                    preference: preference,
                    rank: rank
                })
            }).then((response) => {
                if (response.status === 200) {
                    const token = jwt.sign({
                        id: id
                    }, process.env.JWT_SECRET, {
                        expiresIn: "30d"
                    });

                    socketServer.emit("newUser", {
                        id: id,
                        username: username
                    });

                    return res.redirect(`${process.env.REDIRECT_URI_API}/login/mod?token=${token}`);
                }

                return res.sendStatus(500);
            });
        }

        if (user.patreon === false) {
            if (user.preference === "bl") {
                const beatleader = await fetch(`https://api.beatleader.xyz/player/${id}`).then((res) => res.json());
                compareAvatars(beatleader.avatar, id.toString());
            } else if (user.preference === "ss") {
                const scoresaber = await fetch(`https://scoresaber.com/api/player/${id}/basic`).then((res) => res.json());
                compareAvatars(scoresaber.profilePicture, id.toString());
            }
        }

        const jwtToken = jwt.sign({
            id: id
        }, process.env.JWT_SECRET, {
            expiresIn: "200d"
        });

        return res.redirect(`${process.env.REDIRECT_URI_API}/login/mod#${jwtToken}`);
    }
}