const checkedUsers = [];
const User = require('../models/user');
const ScoreSaber = require('./ss-complete');
const BeatLeader = require('./bl-complete');

module.exports = {
    CheckCompletion: async (userId) => {
        const user = await User.findOne({ userId: userId }).exec();

        if (user.completed == true) return null;
        if (user.diff == 4) return "no-diff";

        if (checkedUsers.includes(userId)) return true;

        checkedUsers.push(userId);

        setTimeout(() => {
            checkedUsers.splice(checkedUsers.indexOf(userId), 1);
        }, 1000 * 60 * 5);

        if (user.pref == "ss") return await ScoreSaber(userId, user.diff);
        else if (user.pref == "bl") return await BeatLeader(userId, user.diff);
    }
}