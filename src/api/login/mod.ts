import { GET } from "../../router";
import { Request, Response } from "express";
import * as fs from "fs";

export class Mod {
    @GET("login/mod")
    get(req: Request, res: Response) {
        const htmlFile = fs.readFileSync("./data/html/modLogin.html", "utf8");

        res.send(htmlFile);
    }
}