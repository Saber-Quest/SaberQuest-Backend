import { SSPlayerScores } from "yabsl/src/scoresaber/players";

export default function pp(response: SSPlayerScores, todayUnix: number, challenge: number[]): boolean {
    for (const data of response.playerScores) {
        if (new Date(data.score.timeSet).getTime() >= todayUnix) {
            if (data.score.pp >= challenge[0]) {
                return true;
            }
        }
    }

    return false;
}