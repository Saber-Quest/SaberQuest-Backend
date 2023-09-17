import { BeatLeaderRes } from "../../../types/beatleaderRes";

export default function xAccuracyPp(response: BeatLeaderRes, todayUnix: number, challenge: number[]): boolean {
    response.data.forEach(async (score) => {
        if (parseInt(score.timeset) >= todayUnix / 1000) {
            if ((score.accuracy * 100) >= challenge[2] && score.pp >= challenge[1]) {
                return true;
            }
        }
    });

    return false;
}