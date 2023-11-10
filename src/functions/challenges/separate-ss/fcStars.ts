import { SSPlayerScores } from "yabsl/src/scoresaber/players";

export default function fcStars(response: SSPlayerScores, todayUnix: number, challenge: number[]): boolean {
    for (const data of response.playerScores) {
        if (new Date(data.score.timeSet).getTime() >= todayUnix) {
            if (data.score.fullCombo && data.leaderboard.stars >= challenge[0]) {
                return true;
            }
        }
    }

    return false;
}