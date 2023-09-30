export type statsRes = {
    users: {
        total: number;
        modUsers: number;
        preferences: {
            BeatLeader: number;
            ScoreSaber: number;
        };
        totalQp: number;
    }
    challenges: {
        total: number;
        totalCompleted: number;
    }
    items: {
        total: number;
        totalOwned: number;
        byRarity: {
            common: number;
            uncommon: number;
            rare: number;
            epic: number;
            legendary: number;
        }
    }
};