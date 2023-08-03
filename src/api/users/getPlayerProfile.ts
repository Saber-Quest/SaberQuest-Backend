import { Request, Response } from "express";
import { GET } from "../../router";
import db from "../../db";

export class PlayerProfile {
    @GET("profile")
    get(req: Request, res: Response) {
        res.send("doesn't exist, go away.");
    }
}