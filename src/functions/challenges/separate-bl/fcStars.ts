import { BLScores } from "yabsl/src/beatleader/scores";

export default function fcStars(response: BLScores, todayUnix: number, challenge: number[]): boolean {
    for (const score of response.data) {
        if (parseInt(score.timeset) >= todayUnix / 1000) {
            if (score.fullCombo && score.leaderboard.difficulty.stars >= challenge[1]) {
                return true;
            }
        }
    }

    return false;
}