import { ScoreSaberRes } from "../../types/scoresaberRes";
import fcNotes from "./separate-ss/fcNotes";
import fcStars from "./separate-ss/fcStars";
import map from "./separate-ss/map";
import passNotes from "./separate-ss/passNotes";
import pp from "./separate-ss/pp";
import xAccuracyNotes from "./separate-ss/xAccuracyNotes";
import xAccuracyPp from "./separate-ss/xAccuracyPp";
import xAccuracyStars from "./separate-ss/xAccuracyStars";

export default async function ScoreSaber(type: string, challenge: number[], id: string): Promise<boolean> {
    const today = new Date().setUTCHours(0, 0, 0, 0);
    const todayUnix = new Date(today).getTime();

    const response: ScoreSaberRes = await fetch(`https://scoresaber.com/api/player/${id}/scores?limit=50&sort=recent`).then((res: any) => res.json());

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

    new Promise((resolve) => {
        resolve(false);
    });
}