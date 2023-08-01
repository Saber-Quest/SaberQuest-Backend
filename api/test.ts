import { Response, Request } from "express";
import { GET } from "router";

@GET("/test")
function Test(req: Request, res: Response) {
    res.send("Test");
}