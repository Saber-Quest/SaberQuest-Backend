export class MapChallenge {
    id: string;
    map_id: string;
    constructor(map_id: string) {
        this.map_id = map_id;
    }
}

export class MapChallengeLeaderboard {
    id: string;
    map_challenge_id: string;
    user_id: string;
    score: number;
    constructor(map_challenge_id: string, user_id: string, score: number) {
        this.map_challenge_id = map_challenge_id;
        this.user_id = user_id;
        this.score = score;
    }
}