import { SSPlayerScores } from "yabsl/src/scoresaber/players";

export default function map(response: SSPlayerScores, todayUnix: number, challenge: number[]): boolean {
    let maps = 0;
    response.playerScores.forEach((data) => {
        if (new Date(data.score.timeSet).getTime() >= todayUnix) {
            maps++;
        }
    });

    if (maps >= challenge[0]) {
        return true;
    }

    return false;
}