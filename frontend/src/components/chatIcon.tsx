import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {createTheme} from '@mui/material/styles';
import {SignInPostResponseBody,} from "../types/signing";
import './../App.css';
import {Chat, Status} from "../types/chat";
import IconButton from "@mui/material/IconButton";
import {timeDifferenceString} from "../utils/time";
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const theme = createTheme();

const setIcon = (status:Status) =>{
    if (status === Status.SENT) {
        return <DoneOutlineOutlinedIcon/>
    } else if (status === Status.DELIVERED) {
        return <DoneIcon/>
    } else {
        return <DoneAllIcon/>
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
export const ChatIcon = (props: { user:SignInPostResponseBody|undefined, chat:Chat,
    currentChat:Chat, setCurrentChat: (t:Chat) => void
    searchUserChat:Chat|undefined, setSearchUserChat:(t:Chat|undefined) => void}) => {

    return (
        <div style={{backgroundColor: props.chat === props.currentChat ? "cadetblue" : "white"}}
             onClick={ (e) =>{handleClick(props.chat, props.setCurrentChat,
                 props.searchUserChat, props.setSearchUserChat)}}>
            {/*<Paper>*/}
                <Grid container marginTop="10px" marginLeft="5px" >
                    <Grid item md={2} sx={{  alignItems: 'end'}}>
                        <IconButton onClick={ (e) =>{handleClick(props.chat, props.setCurrentChat,
                            props.searchUserChat, props.setSearchUserChat)}} sx={{ p: 0 }}>
                            <Avatar alt= {`${props.chat.name}`}
                                    src="/static/images/avatar/2.jpg" />
                        </IconButton>
                    </Grid>
                    <Grid item md={8}  sx={{
                        display: {xs: 'none', md: 'grid'}
                    }}>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'sans-serif',
                                fontWeight: 500,
                                color: 'black',
                                textDecoration: 'none',
                            }}
                        >
                            {props.chat.name}
                        </Typography>
                        <Typography
                            variant="h6"
                            noWrap
                            width="85%"
                            fontSize = '2vh'
                            fontFamily = 'sans-serif'
                            fontWeight = '300'
                            color = 'black'
                        >
                            {props.chat.messages.length > 0 ? props.chat.messages[0].text :"Starting new conversation"}
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
                            }}
                        >
                            {props.chat.messages.length > 0 ? timeDifferenceString(props.chat.messages[props.chat.messages.length-1].timestamp) :" "}
                        </Typography>
                    </Grid>
                </Grid>
           {/* </Paper>*/}
        </div>

    );
}
