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
    const [cardListings, setCardListings] = useState({});
    const { id } = useParams();
    const [searchResultsEbay, setSearchResultsEbay] = useState([]);
    const [searchResultsWatchCount, setSearchResultsWatchCount] = useState([]);
    const placeholderImage = "https://fakeimg.pl/734x1024?text=No+Image";

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
    const PSAClick = async (grade) => {
        setPSAGrade(grade)
    }

    const [returnResults, setReturnResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const handleSearch = (results) => {
        setReturnResults(results);
        setSearchPerformed(true);
    }

    const pullImage = async () => {
        const payload = {
            returnClicked
        };
        try {
            const response = await axios.post("http://localhost:1234/api2", payload);
            setImgUrl(response.data.images.large);
            //setCardEffect(response.data[1]);
            //console.log(cardEffect.abilities);
        } catch (error) {
            console.error(error);
        }
    };

    //send to search on ebay
    const fetchEbaySearchResults = async () => {
        try {
            returnClicked[4] = PSAGrade;
            const payload = {
                returnClicked
            };
            // Fetch eBay search results from server
            const response = await axios.post('http://localhost:1234/ebay-search', payload);

            // Set the fetched data as the search results state
            setSearchResultsEbay(response.data.results);
            setCardListings(response.data.statistics);
        } catch (error) {
            console.error('Error fetching eBay data:', error);
        }
    };
    
    //on Page reload/load
    useEffect(() => {
        if (returnClicked || returnClicked.length != 0) {
            ifBackButton();
            pullImage();
        }
    }, [returnClicked]);

    //on clicking PSAGrade
    useEffect(() => {
        fetchEbaySearchResults();
    }, [PSAGrade]);

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
                    {returnClicked[0] + " #" + returnClicked[3] + " " + PSAGrade}
                </div>
                {PSAGrade === ""
                    ? <div className = "psa_select">
                        <button className = "psa_9" onClick = {() => PSAClick("Psa 9")}>
                            Psa 9
                        </button>
                        <button className = "psa_10" onClick = {() => PSAClick("Psa 10")}>
                            Psa 10
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
                                <div className = "item_Price">
                                    Current Trends
                                    <br />
                                    Min Price: ${cardListings && cardListings.low ? cardListings.low.toFixed(2) : '0.00'}
                                    <br />
                                    Max Price: ${cardListings && cardListings.high ? cardListings.high.toFixed(2) : '0.00'}
                                    <br />
                                    Median Price: ${cardListings && cardListings.median ? cardListings.median.toFixed(2) : '0.00'}
                                    <br />
                                    Average Price: ${cardListings && cardListings.avg ? cardListings.avg.toFixed(2) : '0.00'}
                                </div>
                                <div className = "item_Price">
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