export interface BeatLeaderRes {
    metadata: Metadata
    data: Daum[]
}

export interface Metadata {
    itemsPerPage: number
    page: number
    total: number
}

export interface Daum {
    myScore: any
    leaderboard: Leaderboard
    weight: number
    accLeft: number
    accRight: number
    id: number
    baseScore: number
    modifiedScore: number
    accuracy: number
    playerId: string
    pp: number
    bonusPp: number
    passPP: number
    accPP: number
    techPP: number
    rank: number
    country: string
    fcAccuracy: number
    fcPp: number
    replay: string
    modifiers: string
    badCuts: number
    missedNotes: number
    bombCuts: number
    wallsHit: number
    pauses: number
    fullCombo: boolean
    platform: string
    maxCombo: number
    maxStreak: number
    hmd: number
    controller: number
    leaderboardId: string
    timeset: string
    timepost: number
    replaysWatched: number
    playCount: number
    priority: number
    player: any
    scoreImprovement: ScoreImprovement
    rankVoting: any
    metadata: any
    offsets: Offsets
}

export interface Leaderboard {
    id: string
    song: Song
    difficulty: Difficulty2
    scores: any
    changes: any
    qualification: any
    reweight: any
    leaderboardGroup: any
    plays: number
}

export interface Song {
    id: string
    hash: string
    name: string
    subName: string
    author: string
    mapper: string
    mapperId: number
    coverImage: string
    fullCoverImage: string
    downloadUrl: string
    bpm: number
    duration: number
    tags: string
    uploadTime: number
    difficulties: Difficulty[]
}

export interface Difficulty {
    id: number
    value: number
    mode: number
    difficultyName: string
    modeName: string
    status: number
    modifierValues: ModifierValues
    modifiersRating: any
    nominatedTime: number
    qualifiedTime: number
    rankedTime: number
    stars: any
    predictedAcc: number
    passRating: any
    accRating: any
    techRating: any
    type: number
    njs: number
    nps: number
    notes: number
    bombs: number
    walls: number
    maxScore: number
    duration: number
    requirements: number
}

export interface ModifierValues {
    modifierId: number
    da: number
    fs: number
    sf: number
    ss: number
    gn: number
    na: number
    nb: number
    nf: number
    no: number
    pm: number
    sc: number
    sa: number
    op: number
}

export interface Difficulty2 {
    id: number
    value: number
    mode: number
    difficultyName: string
    modeName: string
    status: number
    modifierValues: ModifierValues2
    modifiersRating: any
    nominatedTime: number
    qualifiedTime: number
    rankedTime: number
    stars: any
    predictedAcc: number
    passRating: any
    accRating: any
    techRating: any
    type: number
    njs: number
    nps: number
    notes: number
    bombs: number
    walls: number
    maxScore: number
    duration: number
    requirements: number
}

export interface ModifierValues2 {
    modifierId: number
    da: number
    fs: number
    sf: number
    ss: number
    gn: number
    na: number
    nb: number
    nf: number
    no: number
    pm: number
    sc: number
    sa: number
    op: number
}

export interface ScoreImprovement {
    id: number
    timeset: string
    score: number
    accuracy: number
    pp: number
    bonusPp: number
    rank: number
    accRight: number
    accLeft: number
    averageRankedAccuracy: number
    totalPp: number
    totalRank: number
    badCuts: number
    missedNotes: number
    bombCuts: number
    wallsHit: number
    pauses: number
}

export interface Offsets {
    id: number
    frames: number
    notes: number
    walls: number
    heights: number
    pauses: number
}  