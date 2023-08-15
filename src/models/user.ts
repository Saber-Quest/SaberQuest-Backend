import { IUserItem } from "../types/user";

export class User {
    id: string;
    platform_id: string;
    steam_id: string;
    username: string;
    avatar: string;
    banner: string;
    border: string;
    preference: string;
    challenge_history: string[];
    items: IUserItem[];
    challenges_completed: number;
    rank: number;
    qp: number;
    value: number;
    diff: number;
    completed: boolean;
}
