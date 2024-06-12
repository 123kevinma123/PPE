import './Main.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from "C:/Users/123ke/OneDrive/Documents/Projects/react-app/client/src/logo.png"

function ItemPage({ setReturnClicked, returnClicked}) {
    const handleItemClick = () => {
        setReturnClicked = [];
    }
    const { id } = useParams();
    console.log(id);
    console.log(returnClicked[0]);
    console.log(returnClicked[1]);
    console.log(returnClicked[2]);
    console.log(returnClicked[3]);
    //if returnClicked == undefined --> repopulate w/ id lol
    return (
        <>
        <a href = "/home">
            <img src = {logo} alt = "logo" className = "transform scale-20" />
        </a>
        </>
    );
}

export default ItemPage;