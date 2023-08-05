import { Request, Response } from "express";
import { GET } from "../../router";
import db from "../../db"
import { xAccuracyFormatter } from "../../formatters/challenges/xAccuracyFormatter";

 //TODO: Typscriptify this (I don't know how)
export class Items {
    @GET("daily-challenges")
    get(req: Request, res: Response) {
        db('ChallengeSets')
          .where({
            id: 'daily'
          })
          .first()
          .select({
            id: 'id',
            name: 'name',
            type: 'type',
            image: 'image',
            resetTime: 'resetTime',
            })
            .then((set) => {
                db('Challenges')
                    .where({
                        'challengeSet': set.id
                    })
                    .select({
                        challengeSet: 'challengeSet',
                        difficulty: 'difficulty',
                        values: 'values',
                    })
                    .then((challenges) => {
                       //TODO: Maybe use a FormatterFactory here
                        return res.json(xAccuracyFormatter.format({
                            id: set.id,
                            name: set.name,
                            type: set.type,
                            image: set.image,
                            resetTime: set.resetTime,
                            difficulties: challenges
                        }));
                    })
            })
            .catch((err) => {
                console.error(err);
                return res.json({success: false, message: 'An error occurred, please try again later.'});
            })
    }
}