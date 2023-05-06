import React, {useState} from 'react'
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import {SignInPostResponseBody} from "../types/signing";
import {undefinedStringToString} from "../utils/signUp";
import {Chat, Message, Status, WebSocketMessage} from "../types/chat";
import { v4 as uuidv4 } from "uuid";

export const TextInput = (props: {
    user:SignInPostResponseBody| undefined,
    chats:Array<Chat>,
    setChats:(t:Array<Chat>) => void,
    currentChat:Chat,
    setCurrentChat:(t:Chat) => void
    setSearchUserChat:(t:Chat|undefined) => void
    setSentMessage: (t:WebSocketMessage|undefined) =>void

}) => {
    const[value, setValue] = useState("")
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const textMessage:string = undefinedStringToString(data.get('input-text')?.toString())
        const newMessage:Message = {
            id: uuidv4(),
            user: {
                id: undefinedStringToString(props.user?.id),
                firstName: undefinedStringToString(props.user?.firstName),
                lastName: undefinedStringToString(props.user?.lastName),
                lastTimeOnline: new Date()
            },
            status: Status.SENT,
            text: textMessage,
            timestamp: new Date()
        }
        let newCurrentChat:Chat = {
            id: props.currentChat.id,
            name: props.currentChat.name,
            participants: props.currentChat.participants,
            messages: props.currentChat.messages
        }
        newCurrentChat.messages.push(newMessage)
        props.setCurrentChat(newCurrentChat)
        let newChats:Array<Chat> = new Array<Chat>(newCurrentChat);
        const idx = props.chats.indexOf(props.currentChat)
        if(idx === -1) {
            props.setSearchUserChat(undefined)
        } else {
            props.chats.splice(idx,1)
        }
        newChats = newChats.concat(props.chats)
        props.setChats(newChats);
        setValue("")
        let participantIds:Array<string> = new Array(0);
        newCurrentChat.participants.forEach((user)=>{
            participantIds.push(user.id)
        })
        const sentMessage:WebSocketMessage = {
            id: newMessage.id,
            chat: {
                id: newCurrentChat.id,
                participants: participantIds,
            },
            sender: newMessage.user,
            text: newMessage.text,
            timestamp: newMessage.timestamp
        }
        props.setSentMessage(sentMessage)



    };
    return (
        <>
            <Box component="form" onSubmit={handleSubmit}noValidate sx={ {display: "flex",
                justifyContent: "center",
                width: "100%",
                margin: "auto"}}>
                <TextField
                    id="input-text"
                    name="input-text"
                    value={value}
                    style = {{width: "100%"}}
                    onChange={(e)=>setValue(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" >
                    <SendIcon />
                </Button>
            </Box>
        </>
    )
}
