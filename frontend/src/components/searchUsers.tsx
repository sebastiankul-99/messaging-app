import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import "./../App.css"
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import {useEffect, useState} from "react";
import {SearchUser} from "../types/search";


const getUsers = async (name:string, setSearchUsers: (t:Array<SearchUser>) => void)=>{

    if(name !==""){
        await fetch(`http://localhost:9091/search?name=${name}`, {
            method: "GET",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((content:Array<SearchUser>) =>{
                console.log(content)
                setSearchUsers(content)
            });
    }
}

export const SearchUsers = (props: {searchUsers:Array<SearchUser>, setSearchUsers: (t:Array<SearchUser>) => void}) => {

    const[valueInput, setValueInput] = useState<string>("")
    useEffect(() => {
        const timer = setTimeout(() => {
            getUsers(valueInput, props.setSearchUsers)
        }, 350);

        return () => clearTimeout(timer);
    }, [valueInput])
    return (

        <Box
            component="form"
            noValidate
            display="flex"
            justifyContent="center"
            alignItems="center"
            margin="auto"
            autoComplete='off'
            onSubmit={(e)=>{e.preventDefault()}}
        >
            <TextField value = {valueInput} sx = {{width: "90%"}} onBlur={(e)=>{
                setTimeout(() => {
                    props.setSearchUsers([]); }, 2000)
                    setValueInput("")
               }}
                       onChange={(e) => setValueInput(e.target.value)}

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