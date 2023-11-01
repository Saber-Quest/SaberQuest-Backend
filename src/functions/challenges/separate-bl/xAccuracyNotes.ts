import { BLScores } from "yabsl/src/beatleader/scores";
import { BeatSaver } from "yabsl";

export default async function xAccuracyNotes(response: BLScores, todayUnix: number, challenge: number[]): Promise<boolean> {
    for (const score of response.data) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        if (parseInt(score.timeset) >= todayUnix / 1000) {
            if ((score.accuracy * 100) >= challenge[1]) {
                const map = await BeatSaver.maps.hash(score.leaderboard.song.hash);

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