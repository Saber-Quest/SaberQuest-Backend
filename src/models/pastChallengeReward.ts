import { Challenge } from "./challenge";
import { Item } from "./item";

export class RewardedChallenge {
    id: string;
    completed_challenge: Challenge;
    item: Item[];
}
