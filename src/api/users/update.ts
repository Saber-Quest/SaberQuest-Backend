import { PUT } from "../../router";
import { User } from "../../models/user";
import db from "../../db";
import { Request, Response } from "express";
import { verifyJWT } from "../../functions/users/jwtVerify";
import { downloadAvatar, downloadBanner } from "../../functions/users/images";
import { clearUserCache } from "../../functions/cache";
import sizeOf from "image-size";

export class Update {
    /**
     * Update about
     * @typedef {object} About
     * @property {string} about.required - The changed about me
     * @property {string} token.required - The user's JWT token
     */

    /**
     * PUT /update/about
     * @summary Update the user's about me
     * @tags Update
     * @security JWT
     * @param {About} request.body.required - The changed about me
     * @return {string} 200 - Success
     * @return {object} 400 - Missing fields
     * @return {object} 400 - About too long
     * @return {object} 400 - Not a patreon
     * @return {object} 400 - Invalid token
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * "OK"
     * @example response - 400 - Missing fields
     * {
     * "error": "Missing fields"
     * }
     * @example response - 400 - About too long
     * {
     * "error": "About too long"
     * }
     * @example response - 400 - Not a patreon
     * {
     * "error": "Not a patreon"
     * }
     * @example response - 400 - Invalid token
     * {
     * "error": "Invalid token"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @PUT("update/about")
    async about(req: Request, res: Response) {
        try {

            const { about, token } = req.body;

            if (!about || !token) {
                return res.status(400).json({ error: "Missing fields" });
            }

            if (about.length > 200) {
                return res.status(400).json({ error: "About too long" });
            }

            const decoded = verifyJWT(token);

            if (!decoded || decoded.exp < Date.now() / 1000) {
                return res.status(400).json({ error: "Invalid token" });
            }

            const user = await db<User>("users")
                .select("patreon")
                .where("platform_id", decoded.id)
                .first();

            if (!user.patreon) {
                return res.status(400).json({ error: "Not a patreon" });
            }

            await db<User>("users")
                .update("about", about)
                .where("platform_id", decoded.id);

            clearUserCache(decoded.id);

            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }

    /**
     * Update username
     * @typedef {object} Username
     * @property {string} username.required - The changed username
     * @property {string} token.required - The user's JWT token
     */

    /**
     * PUT /update/username
     * @summary Update the user's username
     * @tags Update
     * @security JWT
     * @param {Username} request.body.required - The changed username
     * @return {string} 200 - Success
     * @return {object} 400 - Missing fields
     * @return {object} 400 - Username too long
     * @return {object} 400 - Not a patreon
     * @return {object} 400 - Invalid token
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * "OK"
     * @example response - 400 - Missing fields
     * {
     * "error": "Missing fields"
     * }
     * @example response - 400 - Username too long
     * {
     * "error": "About too long"
     * }
     * @example response - 400 - Not a patreon
     * {
     * "error": "Not a patreon"
     * }
     * @example response - 400 - Invalid token
     * {
     * "error": "Invalid token"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @PUT("update/username")
    async username(req: Request, res: Response) {
        try {
            const { username, token } = req.body;

            if (!username || !token) {
                return res.status(400).json({ error: "Missing fields" });
            }

            if (username.length > 20) {
                return res.status(400).json({ error: "Username too long" });
            }

            const decoded = verifyJWT(token);

            if (!decoded || decoded.exp < Date.now() / 1000) {
                return res.status(400).json({ error: "Invalid token" });
            }

            const user = await db<User>("users")
                .select("patreon")
                .where("platform_id", decoded.id)
                .first();

            if (!user.patreon) {
                return res.status(400).json({ error: "Not a patreon" });
            }

            await db<User>("users")
                .update("username", username)
                .where("platform_id", decoded.id);

            clearUserCache(decoded.id);

            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }

    /**
     * Update avatar
     * @typedef {object} Avatar
     * @property {string} avatar.required - The base64 encoded avatar image
     * @property {string} token.required - The user's JWT token
     */

    /**
     * PUT /update/avatar
     * @summary Update the user's avatar
     * @tags Update
     * @security JWT
     * @param {Avatar} request.body.required - The base64 encoded avatar image
     * @return {string} 200 - Success
     * @return {object} 400 - Missing fields
     * @return {object} 400 - Invalid avatar
     * @return {object} 400 - Not a patreon
     * @return {object} 400 - Invalid token
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * "OK"
     * @example response - 400 - Missing fields
     * {
     * "error": "Missing fields"
     * }
     * @example response - 400 - Invalid avatar
     * {
     * "error": "Invalid avatar"
     * }
     * @example response - 400 - Not a patreon
     * }
     * "error": "Not a patreon"
     * }
     * @example response - 400 - Invalid token
     * {
     * "error": "Invalid token"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @PUT("update/avatar")
    async avatar(req: Request, res: Response) {
        try {
            const { avatar, token } = req.body;

            if (!avatar || !token) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const decoded = verifyJWT(token);

            if (!decoded || decoded.exp < Date.now() / 1000) {
                return res.status(400).json({ error: "Invalid token" });
            }

            const user = await db<User>("users")
                .select("patreon")
                .where("platform_id", decoded.id)
                .first();

            if (!user.patreon) {
                return res.status(400).json({ error: "Not a patreon" });
            }

            const buffer = Buffer.from(avatar, "base64");

            const dimensions = sizeOf(buffer);

            if (dimensions.height !== dimensions.width) {
                return res.status(400).json({ error: "Invalid avatar" });
            }

            downloadAvatar(buffer, decoded.id);

            clearUserCache(decoded.id);

            res.sendStatus(200);

        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }

    /**
     * Update avatar border
     * @typedef {object} AvatarBorder
     * @property {string} border.required - The border name
     * @property {string} token.required - The user's JWT token
     */

    /**
     * PUT /update/border
     * @summary Update the user's avatar border
     * @tags Update
     * @security JWT
     * @param {AvatarBorder} request.body.required - The border name
     * @return {string} 200 - Success
     * @return {object} 400 - Missing fields
     * @return {object} 400 - Not a patreon
     * @return {object} 400 - Invalid token
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * "OK"
     * @example response - 400 - Missing fields
     * {
     * "error": "Missing fields"
     * }
     * @example response - 400 - Not a patreon
     * {
     * "error": "Not a patreon"
     * }
     * @example response - 400 - Invalid token
     * {
     * "error": "Invalid token"
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */

    @PUT("update/border")
    async avatarBorder(req: Request, res: Response) {
        try {
            const { border, token } = req.body;

            if (!border || !token) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const decoded = verifyJWT(token);

            if (!decoded || decoded.exp < Date.now() / 1000) {
                return res.status(400).json({ error: "Invalid token" });
            }

            const user = await db<User>("users")
                .select("patreon")
                .where("platform_id", decoded.id)
                .first();

            if (!user.patreon) {
                return res.status(400).json({ error: "Not a patreon" });
            }

            await db<User>("users")
                .update("border", border)
                .where("platform_id", decoded.id);

            clearUserCache(decoded.id);

            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }

    @PUT("update/banner")
    async banner(req: Request, res: Response) {
        const { banner, token } = req.body;
        const type = req.query.type;

        if (!banner || !token || !type) {
            return res.status(400).json({ error: "Missing fields" });
        }

        if (type !== "hor" && type !== "ver") {
            return res.status(400).json({ error: "Invalid type" });
        }

        const decoded = verifyJWT(token);

        if (!decoded || decoded.exp < Date.now() / 1000) {
            return res.status(400).json({ error: "Invalid token" });
        }

        const user = await db<User>("users")
            .select("patreon")
            .where("platform_id", decoded.id)
            .first();

        if (!user.patreon) {
            return res.status(400).json({ error: "Not a patreon" });
        }

        const buffer = Buffer.from(banner, "base64");

        const dimensions = sizeOf(buffer);

        if (type === "hor") {
            if (dimensions.width !== 750 || dimensions.height !== 150) {
                return res.status(400).json({ error: "Invalid banner" });
            }
        } else {
            if (dimensions.width !== 425 || dimensions.height !== 820) {
                return res.status(400).json({ error: "Invalid banner" });
            }
        }

        downloadBanner(buffer, decoded.id, type);

        await db<User>("users")
            .update("banner", true)
            .where("platform_id", decoded.id);
    }
}