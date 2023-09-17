import { ScoreSaberRes } from "../../../types/scoresaberRes";
import { BeatSaverRes } from "../../../types/beatsaverRes";

export default async function xAccuracyNotes(response: ScoreSaberRes, todayUnix: number, challenge: number[]): Promise<boolean> {
    for (const data of response.playerScores) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        if (new Date(data.score.timeSet).getTime() >= todayUnix) {
            if (((data.score.baseScore / data.leaderboard.maxScore) * 100) >= challenge[1]) {
                const map: BeatSaverRes = await fetch(`https://api.beatsaver.com/maps/hash/${data.leaderboard.songHash}`).then((res: any) => res.json());

                for (const diff of map.versions[0].diffs) {
                    if (diff.difficulty === data.leaderboard.difficulty.difficultyRaw.split("_")[1].split("_")[0]) {
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