import { ScoreSaberRes } from "../../../types/scoresaberRes";

export default function xAccuracyPp(response: ScoreSaberRes, todayUnix: number, challenge: number[]): boolean {
    response.playerScores.forEach(async (data) => {
        if (new Date(data.score.timeSet).getTime() >= todayUnix) {
            if (((data.score.baseScore / data.leaderboard.maxScore) * 100) >= challenge[2] && data.score.pp >= challenge[0]) {
                return true;
            }
        }
    });

    return false;
}