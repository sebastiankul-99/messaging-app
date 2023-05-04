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
import Paper from '@mui/material/Paper';
import {chat1} from "../data/chats";
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

export const ChatIcon = (props: { user:SignInPostResponseBody|undefined, chat:Chat, currentChat:Chat, setCurrentChat: (t:Chat) => void }) => {

    return (
        <div style={{backgroundColor: props.chat === props.currentChat ? "cadetblue" : "white"}} onClick={ (e) =>{props.setCurrentChat(props.chat)}}>
            {/*<Paper>*/}
                <Grid container marginTop="10px" marginLeft="5px" >
                    <Grid item md={2} sx={{  alignItems: 'end'}}>
                        <IconButton onClick={()=> { props.setCurrentChat(props.chat)}} sx={{ p: 0 }}>
                            <Avatar alt= {`${props.chat.name}`}
                                    src="/static/images/avatar/2.jpg" />
                        </IconButton>
                    </Grid>
                    <Grid item md={8}  >
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
                            {props.chat.messages[0].text}
                        </Typography>
                    </Grid>
                    <Grid item md = {2} paddingRight="10px" sx={{display: 'flex', flexDirection: 'column',justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                        {
                            setIcon(props.chat.messages[props.chat.messages.length-1].status)
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
                            {timeDifferenceString(props.chat.messages[props.chat.messages.length-1].timestamp)}
                        </Typography>
                    </Grid>
                </Grid>
           {/* </Paper>*/}
        </div>

    );
}
