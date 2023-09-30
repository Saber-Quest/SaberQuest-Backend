export interface IUserItem {
    name_id: string;
    image: string;
    name: string;
    amount: number;
}

interface IUserImages {
    avatar: string;
    banner: boolean;
    border: string;
}

interface IUserInfo {
    id: string;
    username: string;
    about: string;
    images: IUserImages;
    preference: string;
    autoComplete: boolean;
    patreon: boolean;
    banned: boolean;
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
    stats: IUserStats;
    today: IUserToday;
};

export type userInventoryRes = {
    id: string;
    image: string;
    name: string;
    amount: number;
};