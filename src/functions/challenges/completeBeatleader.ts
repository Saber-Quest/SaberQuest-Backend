import { BeatLeader } from "../../types/beatleaderRes";

export default async function BeatLeader(type: string, challenge: number[], id: string): Promise<boolean> {
    const today = new Date("4/27/2023").setUTCHours(0, 0, 0, 0);
    const todayUnix = new Date(today).getTime();

    const response: BeatLeader = await fetch(`https://api.beatleader.xyz/player/${id}/scores?sortBy=date&page=1%count=50`).then((res: any) => res.json());

    if (type === "map") {
        let maps = 0;
        response.data.forEach((score) => {
            if (parseInt(score.timeset) > todayUnix / 1000) {
                maps++;
            }
        });

        if (maps >= challenge[0]) {
            return true;
        }
    } 
}