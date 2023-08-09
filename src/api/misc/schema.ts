import { Response } from "express";
import { GET } from "../../router";

export class Schema {
    @GET("schema/swagger")
    get(res: Response) {
        res.status(200).send("swagger coming soon");
    }
}
