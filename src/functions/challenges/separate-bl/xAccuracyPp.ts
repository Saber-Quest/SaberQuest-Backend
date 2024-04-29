import { BLScores } from "yabsl/src/beatleader/scores";

export default function xAccuracyPp(response: BLScores, todayUnix: number, challenge: number[]): boolean {
    for (const score of response.data) {
        if (parseInt(score.timeset) >= todayUnix / 1000) {
            if ((score.accuracy * 100) >= challenge[2] && score.pp >= challenge[1]) {
                return true;
            }
        }
    }

    return false;
}