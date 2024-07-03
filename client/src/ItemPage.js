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
import axios from 'axios';

function ItemPage({ setReturnClicked, returnClicked, isEntered, setIsEntered}) {
    const handleItemClick = () => {
        setReturnClicked = [];
    }
    const [imgUrl, setImgUrl] = useState("");
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

    const placeholderImage = "https://fakeimg.pl/734x1024?text=No+Image";
    const pullImage = async () => {
        const payload = {
            returnClicked
        };
        try {
            const response = await axios.post("http://localhost:1234/api2", payload);
            setImgUrl(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    
    //on Page reload/load
    useEffect(() => {
        ifBackButton();
        pullImage();
    }, [returnClicked]);

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
                            <div className = "item_Class">
                                <div className = "item_Image">
                                    <div className = "item_Picture">
                                        <img
                                            src = {imgUrl}
                                            alt = "card image"
                                            className = "results_image"
                                            onError = {(e) => e.target.src = placeholderImage}
                                        />
                                    </div>
                                </div>
                                <div className = "item_Details">
                                    Card Details:
                                </div>
                                <div className = "item_Price">
                                    Current $$: <br></ br>
                                    Historic $$:
                                </div>
                            </div>
                            <div className = "item_Graphs">
                                Insert Graphs
                            </div>
                            <div className = "item_Historic_data">
                                History Data
                            </div>
                        </div>
                    </div>
                }
                </>
            )}
        </div>
    );
}

export default ItemPage;