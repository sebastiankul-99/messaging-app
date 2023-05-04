import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {Link, useNavigate} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";
import {SignUpFormValues, SignUpPostRequestBody, } from "../types/signing";
import {
    validateEmail,
    validateFirstName,
    validateLastName,
    validatePassword,
    validateRepeatedPassword,
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

export const SignUpForm = () => {
    const navigate = useNavigate();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const postBody: SignUpPostRequestBody = {
            firstName: undefinedStringToString(data.get('firstName')?.toString()),
            lastName: undefinedStringToString(data.get('lastName')?.toString()),
            email: undefinedStringToString(data.get('email')?.toString()),
            password: undefinedStringToString(data.get('password')?.toString())
        };
        console.log(postBody);
        const response = await fetch(`http://localhost:9090/singup`, {
            method: "POST",
            body: JSON.stringify(postBody),
        })
        if(response.ok) {
            console.log("Successfully signed up!")
            navigate("/")
        } else {
            console.log(response.json())
        }
    };

    const [formValues, setFormValues] = useState<SignUpFormValues>({
        firstName:{
            value:' ',
            error:false,
            errorMessage:'You must enter a first name'
        },
        lastName:{
            value:' ',
            error:false,
            errorMessage:'You must enter a last name'
        },
        email:{
            value:' ',
            error:false,
            errorMessage:'You must enter valid email address'
        },
        password:{
            value:' ',
            error:false,
            errorMessage:'Password must consist of at least 8 characters'
        },
        repeatedPassword:{
            value:' ',
            error:false,
            errorMessage:'Passwords do not match'
        }
    })
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
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        error = {formValues.firstName.error}
                                        helperText={formValues.firstName.error && formValues.firstName.errorMessage}
                                        onBlur={ (e) => validateFirstName(e.target.value, formValues, setFormValues)}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                        error = {formValues.lastName.error}
                                        helperText={formValues.lastName.error && formValues.lastName.errorMessage}
                                        onBlur={ (e) => validateLastName(e.target.value, formValues, setFormValues)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        error = {formValues.email.error}
                                        helperText={formValues.email.error && formValues.email.errorMessage}
                                        onBlur={ (e) => validateEmail(e.target.value, formValues, setFormValues)}
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
                                        error = {formValues.password.error}
                                        helperText={formValues.password.error && formValues.password.errorMessage}
                                        onBlur={ (e) => validatePassword(e.target.value, formValues, setFormValues)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="repeatPassword"
                                        label="Repeat Password"
                                        type="password"
                                        id="repeatPassword"
                                        error = {formValues.repeatedPassword.error}
                                        helperText={formValues.repeatedPassword.error && formValues.repeatedPassword.errorMessage}
                                        onBlur={ (e) => validateRepeatedPassword(e.target.value, formValues, setFormValues)}
                                    />
                                </Grid>
                                <Grid item xs={120}>
                                    <Typography variant="h6" component="h6" align = "justify"
                                                sx = {{
                                                    fontSize: "0.9vw",
                                                    color: "black"
                                                }}
                                    >
                                        By signing up, you agree to our Terms.
                                        Learn how we collect, use and share your data
                                        in our Privacy Policy and how we use cookies
                                        and similar technology in our Cookies Policy.
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Typography variant="body2" color="text.secondary" align="center" >
                                        <Link to="/" color="inherit">
                                            Already have an account? Sign in
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
