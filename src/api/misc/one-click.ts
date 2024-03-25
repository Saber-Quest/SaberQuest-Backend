import { GET } from "../../router";
import { Request, Response } from "express";

export class OneClick {
    @GET("one-click")
    get(req: Request, res: Response): void {
        return res.redirect(`beatsaver://${req.query.map || 1}`)
    }
}