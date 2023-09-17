import BeatLeader from "./completeBeatleader";
import ScoreSaber from "./completeScoresaber";
import giveRewards from "./giveRewards";

export default async function Complete(type: string, challenge: number[], preference: string, id: string, diff: number, challengeId: string) {
    if (preference === "ss") {
        const bool = await ScoreSaber(type, challenge, id);
        if (bool === true) {
            return giveRewards(id, diff, challengeId)
        } else {
            return false;
        }
    } else {
        const bool = await BeatLeader(type, challenge, id);
        if (bool === true) {
            return giveRewards(id, diff, challengeId);
        } else {
            return false;
        }
    }
}