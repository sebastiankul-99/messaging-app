import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import "./../App.css"
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
export const SearchUsers = () => {
    return (

        <Box
            component="form"
            noValidate
            display="flex"
            justifyContent="center"
            alignItems="center"
            margin="auto"
        >
            <TextField sx = {{width: "90%"}}
                       className="inputRounded" label="search users" variant="outlined"
                       InputProps={{
                           startAdornment: (
                               <InputAdornment position="start">
                                   <SearchIcon />
                               </InputAdornment>
                           )
                       }}/>
        </Box>
    );
}