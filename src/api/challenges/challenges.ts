import { Request, Response } from "express";
import { GET } from "../../router";
import db from "../../db"
import { ChallengeSet } from "../../models/challenge-set";
import { Challenge } from "../../models/challenge";
import { FormatterFactory } from "../../formatting/FormatterFactory"

export class Challenges {
    @GET("challenge-set/:set")
    get(req: Request, res: Response) {
        db<ChallengeSet>('ChallengeSets')
            .select('*')
            .leftJoin<Challenge>('Challenges', 'ChallengeSets.id', 'Challenges.challengeSet')
            .where('ChallengeSets.id',  req.params.set)
            .then((rows) => {
                const set: ChallengeSet = new ChallengeSet(rows[0]);
                let diffs = { difficulties: [] as any[] };
                diffs.difficulties.push(...rows.map(function(val) {
                    return new Challenge(val);
                }));

                let formatter = new FormatterFactory().createFormatter(set.type);

                return res.json(formatter.format({ 
                    ...set,
                    ...diffs 
                }));
            })
            .catch((err) => {   
                console.error(err);
                return res.json({ success: false, message: 'An error occurred, please try again later.' });
            });
    }
}