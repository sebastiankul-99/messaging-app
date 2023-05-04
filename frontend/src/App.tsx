import React from 'react';
import logo from './logo.svg';
import './App.css';
import {SignUpForm} from './components/signUpForm'
import {Route, Routes} from 'react-router-dom'
import {SignInForm} from "./components/signInForm";
import {Home} from "./components/home";
function App() {
    return (
        <div className= "App-header">
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path = "/signup" element = {<SignUpForm/>}/>
            </Routes>
        </div>
    );
}

export default App;
