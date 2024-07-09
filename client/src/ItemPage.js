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
import HistoricGraph from"./HistoricGraph";

function ItemPage({ setReturnClicked, returnClicked, isEntered, setIsEntered}) {
    const handleItemClick = () => {
        setReturnClicked = [];
    }
    const [imgUrl, setImgUrl] = useState("");
    const [cardListingCurrent, setCardListingCurrent] = useState({});
    const [cardListingHistoric, setCardListingHistoric] = useState({});
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
            setCardListingCurrent(response.data.statistics);

            //console.log('eBay Search Results:', response.data.results);
            //console.log('eBay Search Statistics:', response.data.statistics);

        } catch (error) {
            console.error('Error fetching eBay data:', error);
        }
    };

    const fetchWatchCountResults = async () => {
        try {
            returnClicked[4] = PSAGrade;
            const payload = {
                returnClicked
            };

            const response = await axios.post('http://localhost:1234/watch-count-search', payload);

            setSearchResultsWatchCount(response.data.results);
            setCardListingHistoric(response.data.statistics);

            //console.log('watchCount Search Results:', response.data.results);
            //console.log('watchCount Search Statistics:', response.data.statistics);

        } catch (error) {
            console.error("Error fetching Watch Count data:", error);
        }
    }
    
    //on Page reload/load
    useEffect(() => {
        if (returnClicked || returnClicked.length != 0) {
            ifBackButton();
            pullImage();
        }
    }, [returnClicked]);

    //on clicking PSAGrade
    useEffect(() => {
        if (returnClicked[0] != null) {
            fetchWatchCountResults();
            fetchEbaySearchResults();
        }
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
                        <button className = "psa_9" onClick = {() => PSAClick("PSA 9")}>
                            Psa 9
                        </button>
                        <button className = "psa_10" onClick = {() => PSAClick("PSA 10")}>
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
                                <div>
                                    <div className = "item_Price">
                                        <div className = "text-black text-2xl mt-2 mb-4 tracking-wider text-center font-bold">Current Trends</div>

                                        <div className = "text-black text-base tracking-wider mb-4 flex">
                                            <div className = "font-bold mx-3">
                                                Min Price: 
                                            </div>
                                            <div className = "">
                                                ${cardListingCurrent && cardListingCurrent.low ? cardListingCurrent.low.toFixed(2) : '0.00'}
                                            </div>
                                        </div>

                                        <div className = "text-black text-base tracking-wider mb-4 flex">
                                            <div className = "font-bold mx-3">
                                                Max Price: 
                                            </div>
                                            <div className = "">
                                                ${cardListingCurrent && cardListingCurrent.high ? cardListingCurrent.high.toFixed(2) : '0.00'}
                                            </div>
                                        </div>

                                        <div className = "text-black text-base tracking-wider mb-4 flex">
                                            <div className = "font-bold mx-3">
                                                Median Price: 
                                            </div>
                                            <div className = "">
                                                ${cardListingCurrent && cardListingCurrent.median ? cardListingCurrent.median.toFixed(2) : '0.00'}
                                            </div>
                                        </div>

                                        <div className = "text-black text-base tracking-wider mb-4 flex">
                                            <div className = "font-bold mx-3">
                                                Average Price: 
                                            </div>
                                            <div className = "">
                                                ${cardListingCurrent && cardListingCurrent.avg ? cardListingCurrent.avg.toFixed(2) : '0.00'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className = "item_Url">
                                        <div className = "text-black text-base tracking-wider items-center">
                                            <a
                                            href = {cardListingCurrent && cardListingCurrent.tempURL ? cardListingCurrent.tempURL : 'https://www.google.com'}
                                            className = "mx-3 block text-center underline"
                                            target = "_blank"
                                            rel = "noopener noreferrer"
                                            >
                                                View Listings
                                            </a>
                                            <div className = "">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className = "item_Price">
                                        <div className = "text-black text-2xl mt-2 mb-4 tracking-wider text-center font-bold">Historic Trends</div>

                                        <div className = "text-black text-base tracking-wider mb-4 flex">
                                            <div className = "font-bold mx-3">
                                                Min Price: 
                                            </div>
                                            <div className = "">
                                                ${cardListingHistoric && cardListingHistoric.low ? cardListingHistoric.low.toFixed(2) : '0.00'}
                                            </div>
                                        </div>

                                        <div className = "text-black text-base tracking-wider mb-4 flex">
                                            <div className = "font-bold mx-3">
                                                Max Price: 
                                            </div>
                                            <div className = "">
                                                ${cardListingHistoric && cardListingHistoric.high ? cardListingHistoric.high.toFixed(2) : '0.00'}
                                            </div>
                                        </div>

                                        <div className = "text-black text-base tracking-wider mb-4 flex">
                                            <div className = "font-bold mx-3">
                                                Median Price: 
                                            </div>
                                            <div className = "">
                                                ${cardListingHistoric && cardListingHistoric.median ? cardListingHistoric.median.toFixed(2) : '0.00'}
                                            </div>
                                        </div>

                                        <div className = "text-black text-base tracking-wider mb-4 flex">
                                            <div className = "font-bold mx-3">
                                                Average Price: 
                                            </div>
                                            <div className = "">
                                                ${cardListingHistoric && cardListingHistoric.avg ? cardListingHistoric.avg.toFixed(2) : '0.00'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className = "item_Url">
                                        <div className = "text-black text-base tracking-wider">
                                            <a
                                            href = {cardListingHistoric && cardListingHistoric.tempURL ? cardListingHistoric.tempURL : 'https://www.google.com'}
                                            className = "mx-3 block text-center underline"
                                            target = "_blank"
                                            rel = "noopener noreferrer"
                                            >
                                                View Listings
                                            </a>
                                            <div className = "">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className = "item_Graphs">
                                <HistoricGraph searchResultsWatchCount = {searchResultsWatchCount}/>
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