import { Response, Request } from "express";
import { GET } from "../../router";

export class Test {
    @GET("test")
    get(req: Request, res: Response) {
        res.send("This was a test for GitHub Actions. Pls work now");
    }
}