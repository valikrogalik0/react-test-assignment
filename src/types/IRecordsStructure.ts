export interface IUserRecord {
    id: number
    delay: number
    created: number
    karma: number
    about: string
    submitted: Array<number>
}

export interface IStoryRecord {
    id: number
    deleted: boolean
    type: string
    by: string
    time: number
    text: string
    dead: boolean
    parent: number
    poll: number
    kids: Array<number>
    url: string
    score: number
    title: string
    parts: Array<number>
    descendants: number
    user: IUserRecord
}
