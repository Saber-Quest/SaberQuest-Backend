import db from "../../db";
import { ChallengeHistory } from "../../models/challengeHistory";
import { ChallengeSet } from "../../models/challengeSet";
import { clearGlobalCache } from "../cache";
import socketServer from "../../websocket";
import { User } from "../../models/user";

async function switchChallenge() {
    const date = new Date().getTime();
    const challenge = await db<ChallengeHistory>("challenge_histories")
        .select("challenge_id", "date")
        .orderBy("date", "desc")
        .first();

    if (date >= new Date(challenge.date).getTime() + (1000 * 60 * 60 * 24)) {
        const challengeSets = await db<ChallengeSet>("challenge_sets")
            .select("*");

        const filtered = challengeSets.filter((set) => set.id !== challenge.challenge_id);

        const random = Math.floor(Math.random() * filtered.length);

        await db<ChallengeHistory>("challenge_histories")
            .insert({
                challenge_id: filtered[random].id,
                date: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
            });

        socketServer.emit("daily", filtered[random].id);

        console.log("[LOG] Switched daily challenge.");

        await db<User>("users")
            .where("diff", ">", 0)
            .update({
                diff: 0
            });

        clearGlobalCache();

        console.log("[LOG] Reset difficulty.");
    }
}

export default switchChallenge;