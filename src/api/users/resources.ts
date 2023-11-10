import { GET } from "../../router";
import { Request, Response } from "express";
import fs from "fs";
import { setCache } from "../../functions/cache";

export class Resources {
    /**
     * GET /profile/{id}/avatar
     * @summary Get a player's avatar
     * @tags Users
     * @param {string} id.path.required - The id of the player
     * @return {image/png} 200 - Success
     * @return {object} 404 - User not found
     * @return {object} 500 - An error occurred
     * @example response - 200 - Success
     * @example response - 404 - User not found
     * {
     * "message": "User not found."
     * }
     * @example response - 500 - An error occurred
     * {
     * "message": "An error occurred, please try again later."
     * }
     */
    @GET("profile/:id/avatar")
    getPlayerAvatar(req: Request, res: Response): Response {
        res.setHeader("Access-Control-Allow-Origin", "*");

        setCache(req, `avatar:${req.params.id}`);

        const id = req.params.id;
        let exists: boolean;

        if (process.env.NODE_ENV === "production") {
            exists = fs.existsSync(`${process.env.PROD_PATH}data/avatars/${id}.png`);
        }
        else {
            exists = fs.existsSync(`./data/avatars/${id}.png`);
        }

        if (!exists) {
            return res.status(404).json({ message: "User not found." });
        }
        try {
            let file: Buffer;

            if (process.env.NODE_ENV === "production") {
                file = fs.readFileSync(`${process.env.PROD_PATH}data/avatars/${id}.png`);
            }
            else {
                file = fs.readFileSync(`./data/avatars/${id}.png`);
            }

            res.setHeader("Content-Type", "image/png");
            res.setHeader("Content-Length", file.length);
            res.status(200).end(file);
        } catch (err) {
            return res.status(500).json({
                message: "An error occurred, please try again later.",
            });
        }
    }

    @GET("profile/:id/banner")
    getPlayerHorizontalBanner(req: Request, res: Response): Response {
        res.setHeader("Access-Control-Allow-Origin", "*");

        const id = req.params.id;
        const style = req.query.style;

        if (!style || !id) {
            return res.status(400).json({ message: "Invalid request" });
        }

        if (style !== "hor" && style !== "ver") {
            return res.status(400).json({ message: "Invalid request" });
        }

        let exists: boolean;

        if (process.env.NODE_ENV === "production") {
            exists = fs.existsSync(`${process.env.PROD_PATH}data/banners/${style}/${id}.png`);
        }
        else {
            exists = fs.existsSync(`./data/banners/${style}/${id}.png`);
        }

        if (!exists) {
            return res.status(404).json({ message: "User not found." });
        }
        try {
            let file: Buffer;

            if (process.env.NODE_ENV === "production") {
                file = fs.readFileSync(`${process.env.PROD_PATH}data/banners/${style}/${id}.png`);
            }
            else {
                file = fs.readFileSync(`./data/banners/${style}/${id}.png`);
            }

            res.setHeader("Content-Type", "image/png");
            res.setHeader("Content-Length", file.length);
            res.status(200).end(file);
        } catch (err) {
            return res.status(500).json({
                message: "An error occurred, please try again later.",
            });
        }
    }
}