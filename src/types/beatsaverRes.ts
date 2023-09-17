export interface BeatSaverRes {
    id: string
    name: string
    description: string
    uploader: Uploader
    metadata: Metadata
    stats: Stats
    uploaded: string
    automapper: boolean
    ranked: boolean
    qualified: boolean
    versions: Version[]
    createdAt: string
    updatedAt: string
    lastPublishedAt: string
    tags: string[]
  }
  
  export interface Uploader {
    id: number
    name: string
    avatar: string
    type: string
    admin: boolean
    curator: boolean
    playlistUrl: string
  }
  
  export interface Metadata {
    bpm: number
    duration: number
    songName: string
    songSubName: string
    songAuthorName: string
    levelAuthorName: string
  }
  
  export interface Stats {
    plays: number
    downloads: number
    upvotes: number
    downvotes: number
    score: number
    reviews: number
  }
  
  export interface Version {
    hash: string
    state: string
    createdAt: string
    sageScore: number
    diffs: Diff[]
    downloadURL: string
    coverURL: string
    previewURL: string
  }
  
  export interface Diff {
    njs: number
    offset: number
    notes: number
    bombs: number
    obstacles: number
    nps: number
    length: number
    characteristic: string
    difficulty: string
    events: number
    chroma: boolean
    me: boolean
    ne: boolean
    cinema: boolean
    seconds: number
    paritySummary: ParitySummary
    maxScore: number
    label: string
  }
  
  export interface ParitySummary {
    errors: number
    warns: number
    resets: number
  }
  