
export enum Status {
    SENT,
    DELIVERED,
    SEEN
}

export type User = {
    id: string,
    firstName: string,
    lastName: string,
    lastTimeOnline: Date
}

export type Message = {
    id: string,
    user: User
    status: Status,
    text: string,
    timestamp: Date
}

export type Chat = {
    id: string
    name: string,
    messages: Array<Message>
}