import './Main.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import CardOfTheDay from "./CardOfTheDay"
import CardSearch from "./CardSearch"
import Results from "./Results"
import Search from "./Search"
import ItemPage from "./ItemPage"

import logo from "C:/Users/123ke/OneDrive/Documents/Projects/react-app/client/src/logo.png"
function Main({ returnResults, setReturnResults, returnClicked, setReturnClicked, isEntered, setIsEntered }) {

    return (
        <div className = "wrapper">
            <div className = "nav_bar">
                { /* <div className = "title">
                    PoKéGraDé
                </div> */ }
                <a href = "/home">
                    <img src = {logo} alt = "logo" className = "logo"/>
                </a>
            </div>
            <Search setReturnResults = {setReturnResults} setIsEntered = {setIsEntered} />
            { /* <CardOfTheDay /> */}
            { /* <CardSearch /> */}
            {/* <Results returnResults = {returnResults} setReturnClicked = {setReturnClicked} setReturnResults/> */}
            <Results setReturnClicked = {setReturnClicked} isEntered setIsEntered = {setIsEntered}/>
            
        </div>
    )
}

export default Main;
