import './Main.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from "C:/Users/123ke/OneDrive/Documents/Projects/react-app/client/src/logo.png"
import "./Main.css"
import "./ItemPage.css"

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

    const [PSAGrade, setPSAGrade] = useState(0);
    const PSAClick = (grade) => {
        setPSAGrade(grade)
    }
    return (
        <div className = "wrapper">
            <div className = "nav_bar_ItemPage">
                <a href = "/home">
                    <img src = {logo} alt = "logo" className = "transform scale-40"/>
                </a>
            </div>
            <div className = "psa_grade">
                <button className = "psa_10" onClick = {() => PSAClick(10)}>
                    PSA 10
                </button>
                <button className = "psa_9" onClick = {() => PSAClick(9)}>
                    PSA 9
                </button>
            </div>
        </div>
    );
}

export default ItemPage;