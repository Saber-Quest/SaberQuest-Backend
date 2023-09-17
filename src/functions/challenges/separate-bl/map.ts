import { BeatLeaderRes } from "../../../types/beatleaderRes";

export default function map(response: BeatLeaderRes, todayUnix: number, challenge: number[]): boolean {
    let maps = 0;
    response.data.forEach((score) => {
        if (parseInt(score.timeset) >= todayUnix / 1000) {
            maps++;
        }
    });

    if (maps >= challenge[0]) {
        return true;
    }

    return false;
}