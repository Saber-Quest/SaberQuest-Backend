import { BeatLeaderRes } from "../../../types/beatleaderRes";
import { BeatSaverRes } from "../../../types/beatsaverRes";

export default async function xAccuracyNotes(response: BeatLeaderRes, todayUnix: number, challenge: number[]): Promise<boolean> {
    for (const score of response.data) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        if (parseInt(score.timeset) >= todayUnix / 1000) {
            if ((score.accuracy * 100) >= challenge[1]) {
                const map: BeatSaverRes = await fetch(`https://api.beatsaver.com/maps/hash/${score.leaderboard.song.hash}`).then((res: any) => res.json());

                for (const diff of map.versions[0].diffs) {
                    if (diff.difficulty === score.leaderboard.difficulty.difficultyName) {
                        if (diff.notes >= challenge[0]) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    
    return new Promise((resolve) => {
        resolve(false);
    });
}