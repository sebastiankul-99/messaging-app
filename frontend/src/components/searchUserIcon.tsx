import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {createTheme} from '@mui/material/styles';
import {SignInPostResponseBody,} from "../types/signing";
import './../App.css';
import {Chat} from "../types/chat";
import IconButton from "@mui/material/IconButton";
import {SearchUser} from "../types/search";
import {undefinedStringToString} from "../utils/signUp";
import {v4 as uuidv4} from "uuid";

const handleClick = (chats:Array<Chat>, searchUser:SearchUser,
                     setSearchChat: (t:Chat) => void, setCurrentChat:(t:Chat) => void,
                     setSearchUsers:(t:Array<SearchUser>) => void,
                     currentUser:SignInPostResponseBody|undefined
    ) => {

    for (let i = 0; i <chats.length; i++) {
        if( chats[i].participants.includes(searchUser)) {
            setCurrentChat(chats[i])
            setSearchUsers([])
            return
        }
    }
    const chat:Chat = {
        id: uuidv4(),
        name: `${searchUser.firstName} ${searchUser.lastName}`,
        participants: [
            {
                id: undefinedStringToString(currentUser?.id),
                firstName: undefinedStringToString(currentUser?.firstName),
                lastName: undefinedStringToString(currentUser?.lastName)
            },
            searchUser
        ],
        messages: [

        ]
    }
    setSearchChat(chat)
    setCurrentChat(chat)
    setSearchUsers([])

}

export const SearchUserIcon = (props: { user:SignInPostResponseBody|undefined, searchUser:SearchUser, chats:Array<Chat>,
    currentChat:Chat, setCurrentChat:(t:Chat) => void, setSearchUsers:(t:Array<SearchUser>) => void,
    searchChat:Chat|undefined, setSearchChat: (t:Chat) => void }) => {


    if(props.user?.id === props.searchUser.id) {
        return <div></div>
    }
    return (
        <div style={{backgroundColor: "white"}} onClick={()=> {handleClick(props.chats, props.searchUser,
            props.setSearchChat, props.setCurrentChat, props.setSearchUsers, props.user)}}>
            {/*<Paper>*/}
            <Grid container marginTop="10px" marginLeft="5px" >
                <Grid item md={2} sx={{  alignItems: 'end'}}>
                    <IconButton onClick={()=> {handleClick(props.chats, props.searchUser,
                        props.setSearchChat, props.setCurrentChat, props.setSearchUsers, props.user)}} sx={{ p: 0 }}>
                        <Avatar alt= {`${props.searchUser.firstName}`}
                                src="/static/images/avatar/2.jpg" />
                    </IconButton>
                </Grid>
                <Grid item md={8}>
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
                        {`${props.searchUser.firstName} ${props.searchUser.lastName}`}
                    </Typography>
                </Grid>

            </Grid>
            {/* </Paper>*/}
        </div>

    );
}
