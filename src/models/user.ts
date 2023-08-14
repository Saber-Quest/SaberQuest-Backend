import { IUserItem } from "../types/user";
import { Challenge } from "./challenge";

export class User {
    id: string;
    username: string;
    avatar: string;
    banner: string;
    border: string;
    preference: string;
    chistory: Challenge[];
    items: IUserItem[];
    challengesCompleted: number;
    rank: number;
    qp: number;
    value: number;
    diff: number;
    completed: boolean;
}
