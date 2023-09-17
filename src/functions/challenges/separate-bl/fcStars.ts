import { BeatLeaderRes } from "../../../types/beatleaderRes";

export default function fcStars(response: BeatLeaderRes, todayUnix: number, challenge: number[]): boolean {
    response.data.forEach(async (score) => {
        if (parseInt(score.timeset) >= todayUnix / 1000) {
            if (score.fullCombo && score.leaderboard.stars >= challenge[1]) {
                return true;
            }
        }
    });

    return false;
}