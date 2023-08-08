export class Challenge {
    challengeSet: string;
    difficulty: string;
    values: any;

    constructor(object: Challenge)
    {
        this.challengeSet = object.challengeSet;
        this.difficulty = object.difficulty;
        this.values = object.values;
    }
}