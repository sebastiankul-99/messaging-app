import * as React from 'react';

import {useEffect, useRef, useState} from "react";
import {
    SignInPostResponseBody,
} from "../types/signing";
import './../styles/home.css';
import {SignInForm} from "./signInForm";
import {CustomNavbar} from "./customNavbar";
import Grid from '@mui/material/Grid';
import {Paper, Stack} from "@mui/material";
import {chat1, chat2, exampleChats} from "../data/chats";
import {Chat, Message, Status, User, WebSocketMessage} from "../types/chat";
import {ChatIcon} from "./chatIcon";
import {TextInput} from "./input"
import {MessageLeft, MessageRight} from "./message";
import {SearchUsers} from "./searchUsers";
import {SearchUser} from "../types/search";
import {SearchUserIcon} from "./searchUserIcon";

import io, {Socket} from 'socket.io-client'
import {v4 as uuidv4} from "uuid";
import {undefinedStringToString} from "../utils/signUp";
const ENDPOINT = "http://localhost:4000/"
var socket: Socket<any, any>;

const makeLine = (searchUsers:Array<SearchUser>) => {
    if(searchUsers.length >0) {
        return <hr style={{width:"100%", color: "black"}}></hr>
    }
}
const setSearchChatDiv = (searchChat:Chat|undefined, user:SignInPostResponseBody|undefined, currentChat:Chat,
                       setCurrentChat: (t:Chat)=>void, searchUserChat:Chat|undefined,
                          setSearchUserChat: (t:Chat|undefined) =>void) =>{
    if (searchChat !== undefined) {
        return <ChatIcon key={searchChat.id} user={user} chat={searchChat}
                         currentChat={currentChat} setCurrentChat={setCurrentChat} searchUserChat={searchUserChat} setSearchUserChat={setSearchUserChat}/>
    }
}
const whichMessage = (user: SignInPostResponseBody|undefined, message:Message) => {
    if (user?.id === message.user.id){
        return <MessageRight message={message}/>
    } else {
        return <MessageLeft message={message}/>
    }
}

const fetchChats = async (id:string, setUserChats: (t:Array<Chat>) =>void, setUserCurrentChat:(t:Chat)=>void) => {
    const response = await fetch(`http://localhost:6020/user/${id}`, {
        method: "GET",
    }).then(async response => {
        if (response.ok) {
            return response.json();
        } else {
            let body = await response.json()
            throw new Error("Error");
        }
    }).then((data: Array<Chat>) => {
        setUserChats(data)
        if (data.length >0) {
            setUserCurrentChat(data[0])
        }
    }).catch((error: Error) => {
    })
};

export const Home = () => {
    const [user, setUser] = useState<SignInPostResponseBody>();
    const [searchUsers, setSearchUsers] = useState<Array<SearchUser>>([])
    const [connectedToSocket, setConnectedToSocket] = useState<boolean>(false)
    const [searchUserChat, setSearchUserChat] = useState<Chat>()
    const [userAccessToken, setUserAccessToken] = useState("")
    const [chats, setChats] = useState<Array<Chat>>(exampleChats);
    const [currentChat, setCurrentChat] = useState<Chat>(chat1)
    const [sentMessage, setSentMessage] = useState<WebSocketMessage>()
    const messagesEndRef = useRef<null | HTMLDivElement>(null)
    useEffect(()=> {
        if(user !==undefined) {
            fetchChats(user.id, setChats, setCurrentChat)
        }

    },[user])
    useEffect(()=> {
        if(user !==undefined) {
            socket = io(ENDPOINT)
            socket.emit("setup", user)
            socket.on('connection',() => {
                setConnectedToSocket(true)
            })
        }

    },[user])
    useEffect(()=> {
        if(user!==undefined){
            socket.emit('join-chat',currentChat.id)
        }

    },[currentChat,user])

    useEffect(()=>{
        if(user !== undefined){
            socket.on("message-received", (messageReceived:WebSocketMessage) => {
                console.log("message received", messageReceived)
                const newMessage:Message = {
                    id: uuidv4(),
                    user: {
                        id: messageReceived.sender.id,
                        firstName: messageReceived.sender.firstName,
                        lastName: messageReceived.sender.lastName,
                    },
                    status: Status.DELIVERED,
                    text: messageReceived.text,
                    timestamp: new Date(messageReceived.timestamp)
                }
                let chatLists:Array<Chat> = structuredClone(chats)
                let index = -1
                for (let i = 0; i < chatLists.length; i++) {
                    if(chatLists[i].id === messageReceived.chat.id) {
                        index = i;
                        break;
                    }
                }
                let newChat:Chat;
                if(index !== -1) {
                    newChat = structuredClone(chatLists[index])
                    newChat.messages.push(newMessage)
                    chatLists.splice(index, 1)
                } else {
                    newChat = {
                        id: messageReceived.chat.id,
                        name: `${messageReceived.sender.firstName} ${messageReceived.sender.lastName}`,
                        participants: [
                            {
                                id: messageReceived.sender.id,
                                firstName: messageReceived.sender.firstName,
                                lastName: messageReceived.sender.lastName

                            },
                            {
                                id: undefinedStringToString(user?.id),
                                firstName: undefinedStringToString(user?.firstName),
                                lastName: undefinedStringToString(user?.lastName),

                            }
                        ],
                        messages: [
                            newMessage
                        ]
                    }
                }
                let tempChat = [newChat]
                tempChat = tempChat.concat(chatLists)
                setChats(tempChat)
                if(currentChat.id === messageReceived.chat.id) {
                    setCurrentChat(newChat)
                }
            })
        }


    })
    useEffect(()=> {
        if(sentMessage!==undefined ){
            socket.emit('new-message',sentMessage)
        }

    },[sentMessage])

    const scrollToBottom = () => {
        if(messagesEndRef.current !==null) {

            console.log("Hi")
            messagesEndRef.current?.scrollIntoView({block: 'nearest'})
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [currentChat, user]);
    if (userAccessToken ==="" && user === undefined){
        return (
            <div className= "">
            <SignInForm setUser={setUser} setUserAccessToken={setUserAccessToken}/>
            </div>

        );
    } else {
        return (
            <div className= "main-div" style={{maxHeight:"100vh"}}>

                <Stack >
                    <CustomNavbar user={user} setUserAccessToken={setUserAccessToken} setUser={setUser}/>
                    <Grid container>



                        <Grid item xs={4} md={3} >
                            <Grid container>
                                <Grid item xs = {12} width = "200%"
                                      bgcolor="white" marginTop="4%" marginBottom="4%">
                                    <SearchUsers searchUsers={searchUsers} setSearchUsers={setSearchUsers}/>
                                </Grid>
                                <Grid item xs = {12} bgcolor="white"sx={{
                                    mb: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "80vh",
                                    overflow: "hidden",
                                    overflowY: "scroll",
                                    // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
                                }}>
                                    {
                                        searchUsers.map((u) =><SearchUserIcon user={user} searchUser={u}
                                                                              chats={chats} currentChat={currentChat}
                                                                              setCurrentChat={setCurrentChat}
                                                                              setSearchUsers={setSearchUsers}
                                                                              searchChat={searchUserChat}
                                                                              setSearchChat={setSearchUserChat}/>)
                                    }
                                    {
                                        makeLine(searchUsers)
                                    }
                                    {
                                        setSearchChatDiv(searchUserChat, user,currentChat,setCurrentChat,
                                            searchUserChat, setSearchUserChat)
                                    }
                                    {
                                        chats.map( (c)=> <ChatIcon key={c.id} user={user} chat={c}
                                                                   currentChat={currentChat}
                                                                   setCurrentChat={setCurrentChat}
                                                                   searchUserChat={searchUserChat}
                                                                   setSearchUserChat={setSearchUserChat}/>)
                                    }
                                </Grid>
                            </Grid>


                        </Grid>
                        <Grid item xs={8} md={6} className = "message-container" sx={{border: "1px solid grey"}}>
                            <Grid container >
                                <Grid item className="message-body" xs={12} sx={{
                                    mb: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "80vh",
                                    overflow: "hidden",
                                    overflowY: "scroll",
                                    maxHeight: "80vh",
                                    // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
                                }}>
                                    {
                                        currentChat.messages.map((message:Message) =>whichMessage(user, message))
                                    }
                                    <div ref={messagesEndRef}/>
                                </Grid>
                                <Grid className="input-div" xs = {12} >
                                    <TextInput user={user} chats={chats} setChats={setChats}
                                               currentChat={currentChat} setCurrentChat={setCurrentChat}
                                               setSearchUserChat={setSearchUserChat}
                                               setSentMessage={setSentMessage}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={0} md={3} sx={{
                            mb: 2,
                            display: "flex",
                            flexDirection: "column",
                            height: "100vh",
                            overflow: "hidden",
                            overflowY: "scroll",
                            // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
                        }} >

                        </Grid>
                    </Grid>
                </Stack>
            </div>

        );
    }

}
