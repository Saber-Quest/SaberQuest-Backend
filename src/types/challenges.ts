interface IDifficulty {
    challenge: number[];
    color: string;
}

interface IDifficulties {
    normal: IDifficulty;
    hard: IDifficulty;
    expert: IDifficulty;
}

export type ChallengeResponse = {
    type: string;
    name: string;
    description: string;
    image: string;
    difficulties: IDifficulties;
    reset_time: number;
};

interface IItem {
    name: string,
    image: string,
    rarity: string
}

interface IChallenge {
    name: string,
    description: string,
    type: string,
    difficulty: {
        name: string,
        challenge: number[]
    }
}

export type ChallengeHistoryResponse = {
    date: string,
    items: IItem[],
    qp: number,
    challenge: IChallenge
};