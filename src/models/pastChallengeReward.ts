import { Challenge } from "./challenge";
import { Item } from "./item";

export class RewardedChallenge {
    id: string;
    completedChallenge: Challenge;
    item: Item[];
}
