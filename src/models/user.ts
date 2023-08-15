import { ChallengeHistory } from "./challengeHistory";

export class User {
    id: string;
    steam_id: string;
    username: string;
    avatar: string;
    banner: string;
    border: string;
    preference: string;
    challenge_history: number[];
    items: string[];
    challenges_completed: number;
    rank: number;
    qp: number;
    value: number;
    diff: number;
    completed: boolean;
}
