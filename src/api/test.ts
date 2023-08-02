import { Request, Response } from "express";
import { GET } from "../router";

export class Test {
    @GET("test")
    get(req: Request, res: Response) {
        res.send("Test Received.");
    }
}