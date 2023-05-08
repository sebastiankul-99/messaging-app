import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {Link} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";
import {
    SignInFormValues,
    SignInPostRequestBody,
    SignInPostResponseBody,

} from "../types/signing";
import './../App.css';
import {
    undefinedStringToString
} from "../utils/signUp";


function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" to="">
                QueTal
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export const SignInForm = ( props: { setUserAccessToken:(t:string) => void,
    setUser: (t:SignInPostResponseBody) => void }) => {

    const [logInError, setLogInError] = useState("");
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const postBody: SignInPostRequestBody = {
            email: undefinedStringToString(data.get('email')?.toString()),
            password: undefinedStringToString(data.get('password')?.toString())
        };
        console.log(postBody);
        const response = await fetch(`http://localhost:9090/singin`, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(postBody),
        }).then(async response => {
            if (response.ok) {
                props.setUserAccessToken(
                    undefinedStringToString(response.headers.get("Quetal-Access-Token")?.toString())
                )
                return response.json();
            } else {
                let body = await response.json()
                throw new Error(body["error"]);
            }
        }).then((data:SignInPostResponseBody) => {
            props.setUser(data)
            setLogInError("")
            console.log(data)
        }).catch((error: Error) => {
            setLogInError(error.message)
        })
    };

    const [formValues, setFormValues] = useState<SignInFormValues>({
        email: {
            value: ' ',
            error: false,
            errorMessage: 'You must enter valid email address'
        },
        password: {
            value: ' ',
            error: false,
            errorMessage: 'Password must consist of at least 8 characters'
        },
    });
    return (

        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'cadetblue' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{color:"black"}}>
                        Sign Up
                    </Typography>
                    <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"

                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="body1" color="darkred" align="left"  marginTop="4vh">
                                {logInError}
                            </Typography>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Sign In
                            </Button>
                        </Grid>

                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Typography variant="body2" color="text.secondary" align="center" >
                                    <Link to="/signup" color="inherit">
                                        Do not have an account?? Sign up
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>


    );
}
