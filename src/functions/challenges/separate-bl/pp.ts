import { BeatLeaderRes } from "../../../types/beatleaderRes";

export default function pp(response: BeatLeaderRes, todayUnix: number, challenge: number[]): boolean {

    for (const score of response.data) {
        if (parseInt(score.timeset) >= todayUnix / 1000) {
            if (score.pp >= challenge[1]) {
                return true;
            }
        }
    }

    return false;
}