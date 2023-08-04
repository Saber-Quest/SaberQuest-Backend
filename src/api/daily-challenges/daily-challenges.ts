import { Request, Response } from "express";
import { GET } from "../../router";

export class Items {
    @GET("daily-challenges")
    get(req: Request, res: Response) {
        res.json({"challenges": [
            {
                "difficulty": "Easy",
                "type": "ppacc",
                "shortName": "PP W/ Acc",
                "description": "Play Maps With this many PP",
                "value": "BL: 250\nSS:300"
            },
            {
                "difficulty": "Normal",
                "type": "ppacc",
                "shortName": "PP W/ Acc",
                "description": "Play Maps With this many PP",
                "value": "BL: 250\nSS:300"
            },
            {
                "difficulty": "Hard",
                "type": "ppacc",
                "shortName": "PP W/ Acc",
                "description": "Play Maps With this many PP",
                "value": "BL: 250\nSS:300"
            },
            {
                "difficulty": "Extreme",
                "type": "ppacc",
                "shortName": "PP W/ Acc",
                "description": "Get PP on either service while keeping accuracy",
                "value": "BL: 250\nSS:300"
            }
        ]});
    }
}