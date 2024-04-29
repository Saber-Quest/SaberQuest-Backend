import fcNotes from "./separate-ss/fcNotes";
import fcStars from "./separate-ss/fcStars";
import map from "./separate-ss/map";
import passNotes from "./separate-ss/passNotes";
import pp from "./separate-ss/pp";
import xAccuracyNotes from "./separate-ss/xAccuracyNotes";
import xAccuracyPp from "./separate-ss/xAccuracyPp";
import xAccuracyStars from "./separate-ss/xAccuracyStars";
import * as yabsl from "yabsl";

export default async function ScoreSaber(type: string, challenge: number[], id: string): Promise<boolean> {
    const today = new Date().setUTCHours(0, 0, 0, 0);
    const todayUnix = new Date(today).getTime();

    const response = await yabsl.ScoreSaber.players.scores(id, "recent", 1, 50);

    switch (type) {
        case "fcnotes":
            return await fcNotes(response, todayUnix, challenge);
        case "fcstars":
            return fcStars(response, todayUnix, challenge);
        case "pp":
            return pp(response, todayUnix, challenge);
        case "map":
            return map(response, todayUnix, challenge);
        case "passnotes":
            return await passNotes(response, todayUnix, challenge);
        case "xaccuracynotes":
            return await xAccuracyNotes(response, todayUnix, challenge);
        case "xaccuracypp":
            return xAccuracyPp(response, todayUnix, challenge);
        case "xaccuracystars":
            return xAccuracyStars(response, todayUnix, challenge);
    }

    new Promise((resolve) => {
        resolve(false);
    });
}