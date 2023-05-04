import * as React from 'react';

import {createRef, useEffect, useRef, useState} from "react";
import {
    SignInPostResponseBody,
} from "../types/signing";
import './../styles/home.css';
import {SignInForm} from "./signInForm";
import {CustomNavbar} from "./customNavbar";
import Grid from '@mui/material/Grid';
import {Paper, Stack} from "@mui/material";
import {chat1, chat2, exampleChats} from "../data/chats";
import {Chat, Message, User} from "../types/chat";
import {ChatIcon} from "./chatIcon";
import {TextInput} from "./input"
import {MessageLeft, MessageRight} from "./message";
import {SearchUsers} from "./searchUsers";


const whichMessage = (user: SignInPostResponseBody|undefined, message:Message) => {
    if (user?.id === message.user.id){
        return <MessageRight message={message}/>
    } else {
        return <MessageLeft message={message}/>
    }
}
export const Home = () => {
    const [user, setUser] = useState<SignInPostResponseBody>();
    const [userAccessToken, setUserAccessToken] = useState("")
    const [chats, setChats] = useState<Array<Chat>>(exampleChats);
    const [currentChat, setCurrentChat] = useState<Chat>(chat1)
    const messagesEndRef = useRef<null | HTMLDivElement>(null)
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
                                    <SearchUsers/>
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
                                        chats.map( (c)=> <ChatIcon key={c.id} user={user} chat={c} currentChat={currentChat} setCurrentChat={setCurrentChat}/>)
                                    }
                                </Grid>
                            </Grid>


                        </Grid>
                        <Grid item xs={8} md={6} className = "message-container" >
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
                                <Grid className="input-div" xs = {12}>
                                    <TextInput user={user} chats={chats} setChats={setChats} currentChat={currentChat} setCurrentChat={setCurrentChat}/>
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
                            <Paper>xs=4</Paper>
                        </Grid>
                    </Grid>
                </Stack>
            </div>

        );
    }

}
