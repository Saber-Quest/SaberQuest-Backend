export interface ScoreSaberRes {
    playerScores: PlayerScore[]
    metadata: Metadata
}

export interface PlayerScore {
    score: Score
    leaderboard: Leaderboard
}

export interface Score {
    id: number
    rank: number
    baseScore: number
    modifiedScore: number
    pp: number
    weight: number
    modifiers: string
    multiplier: number
    badCuts: number
    missedNotes: number
    maxCombo: number
    fullCombo: boolean
    hmd: number
    timeSet: string
    hasReplay: boolean
}

export interface Leaderboard {
    id: number
    songHash: string
    songName: string
    songSubName: string
    songAuthorName: string
    levelAuthorName: string
    difficulty: Difficulty
    maxScore: number
    createdDate: string
    rankedDate: any
    qualifiedDate: any
    lovedDate: any
    ranked: boolean
    qualified: boolean
    loved: boolean
    maxPP: number
    stars: number
    plays: number
    dailyPlays: number
    positiveModifiers: boolean
    playerScore: any
    coverImage: string
    difficulties: any
}

export interface Difficulty {
    leaderboardId: number
    difficulty: number
    gameMode: string
    difficultyRaw: string
}

export interface Metadata {
    total: number
    page: number
    itemsPerPage: number
}  