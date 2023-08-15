import { ChallengeHistory } from "../models/challengeHistory";

import { Challenge } from "../models/challenge";

export interface IUserItem {
    id: string;
    image: string;
    name: string;
    amount: number;
}

interface IUserImages {
    avatar: string;
    banner: string;
    border: string;
}

interface IUserInfo {
    id: string;
    steam_id: string;
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
