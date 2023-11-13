import db from "../../db";
import { User } from "../../models/user";
import { ChallengeHistory } from "../../models/challengeHistory";
import Complete from "./complete";

export default async function autoComplete() {
    const time = Date.now();

    if (time >= (new Date().setUTCHours(23, 58, 0, 0) - 120000)) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let people = await db<User>("users")
            .select("*")
            .where("auto_complete", true);

        const completed = await db<ChallengeHistory>("challenge_histories")
            .select("user_id", "date")
            .orderBy("date", "desc");

        for (const person of completed) {
            if (new Date(person.date).setUTCHours(0, 0, 0, 0) < new Date().setUTCHours(0, 0, 0, 0)) {
                break;
            }
            if (new Date(person.date).setUTCHours(0, 0, 0, 0) === new Date().setUTCHours(0, 0, 0, 0)) {
                people.splice(people.findIndex((p) => p.id === person.user_id), 1);
            }
        }

        for (const player of people) {
            const dailyChallenge = await db<ChallengeHistory>("challenge_histories")
                .join("challenge_sets", "challenge_histories.challenge_id", "=", "challenge_sets.id")
                .join("difficulties", "challenge_sets.id", "=", "difficulties.challenge_id")
                .select("challenge_sets.type", "challenge_sets.id", "difficulties.challenge", "difficulties.diff")
                .where("difficulties.diff", player.diff)
                .orderBy("date", "desc")
                .first();

            await Complete(dailyChallenge.type, dailyChallenge.challenge, player.preference, player.platform_id, player.diff, player.id);
        }
    }
}