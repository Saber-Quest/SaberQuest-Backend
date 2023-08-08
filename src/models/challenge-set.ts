export class ChallengeSet {
    id: string;
    name: string;
    type: string;
    image: string;
    resetTime: string;
    difficulties: any;

    constructor(object: ChallengeSet)
    {
        this.id = object.id;
        this.name = object.name;
        this.type = object.type;
        this.image = object.image;
        this.resetTime = object.resetTime;
    }
}