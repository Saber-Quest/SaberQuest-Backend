import { ChallengeHistory } from "./challengeHistory";

export class User {
    id: string;
    steam_id: string;
    username: string;
    avatar: string;
    banner: string;
    border: string;
    preference: string;
    chistory: number[];
    items: string[];
    challengesCompleted: number;
    rank: number;
    qp: number;
    value: number;
    diff: number;
    completed: boolean;
}
