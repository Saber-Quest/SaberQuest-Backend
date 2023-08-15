import { ChallengeSet } from "./challengeSet";
import { Difficulty } from "./difficulty";

export class Challenge {
    id: string;
    challenge_set: ChallengeSet;
    challenge_set_id: string;
    type: string;
    difficulty: Difficulty;
}
