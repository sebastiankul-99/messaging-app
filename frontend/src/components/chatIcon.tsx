import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {SignInPostResponseBody,} from "../types/signing";
import './../App.css';
import {Chat, Status} from "../types/chat";
import IconButton from "@mui/material/IconButton";
import {timeDifferenceString} from "../utils/time";
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const setIcon = (status:Status) =>{
    if (status === Status.SENT) {
        return <DoneOutlineOutlinedIcon sx={{ color: "#B6B2B2" }}/>
    } else if (status === Status.DELIVERED) {
        return <DoneIcon sx={{ color: "black" }}/>
    } else {
        return <DoneAllIcon color="secondary"/>
    }
}

const handleClick = (chat:Chat, setCurrentChat: (t:Chat) => void,
        searchUserChat:Chat|undefined, setSearchUserChat:(t:Chat|undefined) => void) => {
    if(searchUserChat!== undefined && chat !== searchUserChat) {
        setSearchUserChat(undefined)
    }
    if(chat.messages.length>0) {
        if(chat.messages[chat.messages.length-1].status === Status.DELIVERED &&
            chat.messages[chat.messages.length-1].user.id !== searchUserChat?.id) {
            chat.messages[chat.messages.length-1].status = Status.SEEN
        }
    }

    setCurrentChat(chat)
}

const getUserName = (c:Chat, currentUser:SignInPostResponseBody|undefined): string => {

    for (let i =0 ; i< c.participants.length; i++) {
        if (c.participants[i].id !== currentUser?.id) {

            return `${c.participants[i].firstName} ${c.participants[i].lastName}`
        }
    }
    return ""
}
const isYou = (c:Chat, user:SignInPostResponseBody|undefined) => {
    if(c.messages[c.messages.length-1].user.id === user?.id) {
        return "You: "
    }
    return ""
}
export const ChatIcon = (props: { user:SignInPostResponseBody|undefined, chat:Chat,
    currentChat:Chat, setCurrentChat: (t:Chat) => void
    searchUserChat:Chat|undefined, setSearchUserChat:(t:Chat|undefined) => void}) => {

    return (
        <div style={{backgroundColor: props.chat === props.currentChat ? "cadetblue" : "white"}}
             onClick={ (e) =>{handleClick(props.chat, props.setCurrentChat,
                 props.searchUserChat, props.setSearchUserChat)}}>
            {/*<Paper>*/}
                <Grid container  marginTop="12px" marginLeft="5px" >
                    <Grid item md={2} sx={{
                        alignItems: 'center',

                    }}>
                        <IconButton onClick={ (e) =>{handleClick(props.chat, props.setCurrentChat,
                            props.searchUserChat, props.setSearchUserChat)}} sx={{ p:0,
                            marginBottom: {
                                xs: "12px", sm: "12px", md:"0"
                            }}}>
                            <Avatar alt= {`${props.chat.name}`}
                                    src="/static/images/avatar/2.jpg" />
                        </IconButton>
                    </Grid>
                    <Grid item md={8} sx = {{
                    }}>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                fontFamily: 'sans-serif',
                                fontWeight: 500,
                                color: 'black',
                                textDecoration: 'none',
                                typography: {lg: "h6", md: 'body1', xs: "body1", },
                                fontSize: {
                                    sm: "none", xs: '2.5vw'
                                },
                                marginLeft: {
                                    md: '0', sm:"10px", xs: "10px"
                                },
                                marginTop: {
                                    sm:"0", xs: "7%"
                                }
                            }}
                        >
                            {getUserName(props.chat, props.user)}
                        </Typography>
                        <Typography

                            variant="h6"
                            noWrap
                            width="90%"
                            fontSize = '2vh'
                            fontFamily = 'sans-serif'
                            fontWeight = '300'
                            color = 'black'

                            sx={{
                                display: { xs: 'none', md: 'grid' },
                                width: {
                                    lg: "85%",
                                    md:"70%",
                                }
                            }}
                        >
                            <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                {props.chat.messages.length > 0 ? isYou(props.chat, props.user) + props.chat.messages[props.chat.messages.length -1].text :"Starting new conversation"}
                            </div>

                        </Typography>
                    </Grid>
                    <Grid item md = {2} paddingRight="10px" sx={{display: { xs: 'none', md: 'flex' }, flexDirection: 'column',justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                        {
                            props.chat.messages.length > 0 ? setIcon(props.chat.messages[props.chat.messages.length-1].status): ""
                        }
                        <Typography
                            variant="h6"
                            noWrap

                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                fontSize: '2vh',
                                fontFamily: 'sans-serif',
                                fontWeight: 300,
                                color: 'black',
                                textDecoration: 'none',
                                verticalAlign: 'bottom',
                                noWrap: 'true'
                            }}
                        >
                            {props.chat.messages.length > 0 ? timeDifferenceString(new Date(props.chat.messages[props.chat.messages.length-1].timestamp)) :" "}
                        </Typography>
                    </Grid>
                </Grid>
           {/* </Paper>*/}
        </div>

    );
}
