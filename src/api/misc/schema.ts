import { Response, Request } from "express";
import { GET } from "../../router";

export class Schema {
    @GET("schema/swagger")
    getSwagger(res: Response, req: Request) {
        res.status(200).send("swagger coming soon");
    }
}