import React from "react";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';

import "./../styles/message.css"
import {Message} from "../types/chat";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export const MessageLeft = (props : {
        message: Message
}) => {
    const message = props.message ? props.message.text : "no message";


    const timestamp = props.message.timestamp ? new Date(props.message.timestamp).toDateString() : "";
    const photoURL = props.message.user.firstName
    const displayName = props.message.user.firstName

    return (
        <>
            <div className="messageRow">
                <Avatar
                    alt={displayName}
                    sx = {{
                        color: "black",
                        backgroundColor: deepOrange[500],
                    }}
                    src={photoURL}
                ></Avatar>
                <div>
                    <Typography
                        variant="h6"
                        fontFamily = 'sans-serif'
                        fontWeight = '300'
                        color = 'black'
                        marginLeft= "0.6em"
                    >
              {/*          {displayName}*/}
                    </Typography>
                    <Grid className="messageBlue" maxWidth="90%">
                        <Typography
                            variant="h6"
                            fontSize = '2vh'
                            fontFamily = 'sans-serif'
                            fontWeight = '300'
                            color = 'black'
                        >
                            {message}
                        </Typography>
                        <Typography
                            variant="h6"
                            fontSize = '1.2vh'
                            fontFamily = 'sans-serif'
                            fontWeight = '300'
                            color = 'black'

                        >
                            {timestamp}
                        </Typography>
                    </Grid>
                </div>
            </div>
        </>
    );
};

export const MessageRight = (props : {
    message: Message
}) => {
    const message = props.message ? props.message.text : "no message";
    const timestamp = props.message.timestamp ? new Date(props.message.timestamp).toDateString() : "";
    return (
        <div className="messageRowRight">
            <Grid className="messageOrange" maxWidth="70%">
                <Typography
                    variant="h6"
                    fontSize = '2vh'
                    fontFamily = 'sans-serif'
                    fontWeight = '300'
                    color = 'black'
                    textAlign = "left"

                >
                    {message}
                </Typography>
                <Typography
                    variant="h6"
                    fontSize = '1.2vh'
                    fontFamily = 'sans-serif'
                    fontWeight = '300'
                    color = 'black'
                    textAlign = "right"

                >
                    {timestamp}
                </Typography>
            </Grid>
        </div>
    );
};
