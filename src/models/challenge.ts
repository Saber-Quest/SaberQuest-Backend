export class Challenge {
    type: string;
    difficulties: {
        easy: number[];
        normal: number[];
        hard: number[];
        extreme: number[];
    };
}