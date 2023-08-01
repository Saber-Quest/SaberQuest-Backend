import { Response, Request } from "express";
import { GET } from "router";

export class Test {
    @GET("/")
    getTest(req: Request, res: Response) {
        res.send("Hello, World!")
    }
}