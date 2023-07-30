const checkedUsers: string[] = [];
import User from "../models/user";
import ScoreSaber from "./ss-complete";
import BeatLeader from "./bl-complete";
import { Completion } from "../types/completion";

async function CheckCompletion(userId: string): Promise<null | boolean | null | string | undefined | Completion> {
  const user = await User.findOne({ userId: userId }).exec();

  if (user!.completed == true) return null;
  if (user!.diff == 4) return "no-diff";

  if (checkedUsers.includes(userId)) return true;

  checkedUsers.push(userId);

  setTimeout(() => {
    checkedUsers.splice(checkedUsers.indexOf(userId), 1);
  }, 1000 * 60 * 5);

  if (user!.pref == "ss") return await ScoreSaber(userId, user!.diff);
  else if (user!.pref == "bl") return await BeatLeader(userId, user!.diff);
}

export default CheckCompletion;