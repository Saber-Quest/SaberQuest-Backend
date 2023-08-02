import { Request, Response } from "express";
import { GET } from "../../router";

export class PlayerProfile {
    @GET("profile")
    get(req: Request, res: Response) {
        res.send("user found, returning.")
    }
}