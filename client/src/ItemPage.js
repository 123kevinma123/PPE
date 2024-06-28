import './Main.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from "C:/Users/123ke/OneDrive/Documents/Projects/react-app/client/src/logo.png"
import "./Main.css"
import "./ItemPage.css"
import "./Results.css"
import "./Search.css"
import Main from "./Main"
import Search from "./Search"
import Results from "./Results"

function ItemPage({ setReturnClicked, returnClicked, isEntered, setIsEntered}) {
    const handleItemClick = () => {
        setReturnClicked = [];
    }
    const { id } = useParams();
    //console.log(id);
    //console.log(returnClicked[0]);
    //console.log(returnClicked[1]);
    //console.log(returnClicked[2]);
    //console.log(returnClicked[3]);
    //if returnClicked == undefined --> repopulate w/ id lol
    const ifBackButton = () => {
        if (!returnClicked || returnClicked.length === 0) {
            const newReturnClicked = [];
            let count = 0;
            let start = 0;

            while (count < id.length) {
                if (id.charAt(count) === '+') {
                    newReturnClicked.push(id.substring(start, count));
                    start = count + 1;
                }
                count++;
            }
            newReturnClicked.push(id.substring(start, id.length));
            setReturnClicked(newReturnClicked);
        }
    }
    useEffect(() => {
        ifBackButton();
    }, [returnClicked]);

    const [PSAGrade, setPSAGrade] = useState("");
    const PSAClick = (grade) => {
        setPSAGrade(grade)
    }

    const [returnResults, setReturnResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const handleSearch = (results) => {
        setReturnResults(results);
        setSearchPerformed(true);
    }
    return (
        <div className = "itemPage_wrapper">
            <div className = "nav_bar_ItemPage">
                <a href = "/home">
                    <img src = {logo} alt = "logo" className = "logo"/>
                </a>
            </div>
            <div className = "psa_search">
            <Search setReturnResults = {setReturnResults} setIsEntered = {setIsEntered} />
            { /* <CardOfTheDay /> */}
            { /* <CardSearch /> */}
            {/* <Results returnResults = {returnResults} setReturnClicked = {setReturnClicked} setReturnResults/> */}
            <Results setReturnClicked = {setReturnClicked} isEntered setIsEntered = {setIsEntered}/>
            </div>
            <div>
    </div>
            {!searchPerformed && (
                <>
                <div className = "psa_title">
                    {returnClicked[0] + " " + returnClicked[1] + " " + returnClicked[2] + " #" + returnClicked[3]}
                </div>
                {PSAGrade === ""
                    ? <div className = "psa_select">
                        <button className = "psa_9" onClick = {() => PSAClick("PSA9")}>
                            PSA 9
                        </button>
                        <button className = "psa_10" onClick = {() => PSAClick("PSA10")}>
                            PSA 10
                        </button>
                    </div>
                    : <div>
                        {console.log(PSAGrade)}
                        <div className = "item_Results">
                            Hello World
                        </div>
                    </div>
                }
                </>
            )}
        </div>
    );
}

export default ItemPage;