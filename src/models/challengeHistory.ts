import { Challenge } from "./challenge";

export class ChallengeHistory {
    id: string;
    challenges: Challenge[];
    date: Date; // UTC ISO string formatted.
}
