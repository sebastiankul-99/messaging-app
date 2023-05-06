import {SearchUser} from "./search";

export enum Status {
    SENT,
    DELIVERED,
    SEEN
}

export type User = {
    id: string,
    firstName: string,
    lastName: string,
    lastTimeOnline?: Date
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
    participants: Array<SearchUser>
    messages: Array<Message>
}

export type WebSocketChat = {
    id: string
    participants: Array<string>
}

export type WebSocketMessage = {
    id: string,
    chat: WebSocketChat,
    sender: User
    text: string,
    timestamp: Date
}
