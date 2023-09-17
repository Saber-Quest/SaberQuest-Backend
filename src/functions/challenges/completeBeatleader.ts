import { BeatLeaderRes } from "../../types/beatleaderRes";
import fcNotes from "./separate-bl/fcNotes";
import fcStars from "./separate-bl/fcStars";
import map from "./separate-bl/map";
import passNotes from "./separate-bl/passNotes";
import pp from "./separate-bl/pp";
import xAccuracyNotes from "./separate-bl/xAccuracyNotes";
import xAccuracyPp from "./separate-bl/xAccuracyPp";
import xAccuracyStars from "./separate-bl/xAccuracyStars";

export default async function BeatLeader(type: string, challenge: number[], id: string): Promise<boolean> {
    const today = new Date("4/27/2023").setUTCHours(0, 0, 0, 0);
    const todayUnix = new Date(today).getTime();

    const response: BeatLeaderRes = await fetch(`https://api.beatleader.xyz/player/${id}/scores?sortBy=date&page=1%count=50`).then((res: any) => res.json());

    switch (type) {
        case "fcNotes":
            return await fcNotes(response, todayUnix, challenge);
        case "fcStars":
            return fcStars(response, todayUnix, challenge);
        case "pp":
            return pp(response, todayUnix, challenge);
        case "map":
            return map(response, todayUnix, challenge);
        case "passNotes":
            return await passNotes(response, todayUnix, challenge);
        case "xAccuracyNotes":
            return await xAccuracyNotes(response, todayUnix, challenge);
        case "xAccuracyPp":
            return xAccuracyPp(response, todayUnix, challenge);
        case "xAccuracyStars":
            return xAccuracyStars(response, todayUnix, challenge);
    }

    return new Promise((resolve) => {
        resolve(false);
    });
}