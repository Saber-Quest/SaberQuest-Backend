import { ScoreSaberRes } from "../../../types/scoresaberRes";

export default function pp(response: ScoreSaberRes, todayUnix: number, challenge: number[]): boolean {
    response.playerScores.forEach((data) => {
        if (new Date(data.score.timeSet).getTime() >= todayUnix) {
            if (data.score.pp >= challenge[0]) {
                return true;
            }
        }
    });

    return false;
}