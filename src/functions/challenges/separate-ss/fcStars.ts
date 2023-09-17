import { ScoreSaberRes } from "../../../types/scoresaberRes";

export default function fcStars(response: ScoreSaberRes, todayUnix: number, challenge: number[]): boolean {
    response.playerScores.forEach(async (data) => {
        if (new Date(data.score.timeSet).getTime() >= todayUnix) {
            if (data.score.fullCombo && data.leaderboard.stars >= challenge[0]) {
                return true;
            }
        }
    });

    return false;
}