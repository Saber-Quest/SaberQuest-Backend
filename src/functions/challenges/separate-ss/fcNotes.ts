import { SSPlayerScores } from "yabsl/src/scoresaber/players";
import { BeatSaver } from "yabsl";

export default async function fcNotes(response: SSPlayerScores, todayUnix: number, challenge: number[]): Promise<boolean> {
    for (const data of response.playerScores) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        if (new Date(data.score.timeSet).getTime() >= todayUnix) {
            if (data.score.fullCombo) {
                const map = await BeatSaver.maps.hash(data.leaderboard.songHash);

                for (const diff of map.versions[0].diffs) {
                    if (diff.difficulty === data.leaderboard.difficulty.difficultyRaw.split("_")[1].split("_")[0]) {
                        console.log("diff.notes: " + diff.notes);
                        if (diff.notes >= challenge[0]) {
                            console.log("fcNotes true");
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