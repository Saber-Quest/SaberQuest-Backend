export type Completion = {
    message: string;
    difficulty: string;
    rewards: {
        collectibles: string[],
        points: number
    };
}