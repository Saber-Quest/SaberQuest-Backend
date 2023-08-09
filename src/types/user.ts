interface IUserImages {
    avatar: string;
    banner: string;
    border: string;
}

interface IUserInfo {
    id: string;
    username: string;
    images: IUserImages;
    preference: string;
}

interface IUserStats {
    challengesCompleted: number;
    rank: number;
    qp: number;
    value: number;
}

interface IUserToday {
    diff: number;
    completed: boolean;
}

export type userRes = {
    userInfo: IUserInfo;
    chistory: number[];
    items: string[];
    stats: IUserStats;
    today: IUserToday;
};
