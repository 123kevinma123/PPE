import './Main.css';
import { useEffect, useState } from 'react';
import CardOfTheDay from "./CardOfTheDay"
import CardSearch from "./CardSearch"
import Results from "./Results"
import Search from "./Search"
function Main() {
    const [returnResults, setReturnResults] = useState([]);
    return (
        <div className = "wrapper">
            <div className = "nav_bar">
                <div className = "title">
                    Graded Pokemon Price Estimator
                </div>
            </div>
            <Search setReturnResults = {setReturnResults}/>
            { /* <CardOfTheDay /> */}
            { /* <CardSearch /> */}
            {returnResults && returnResults.length > 0 && (
                <Results returnResults={returnResults} />
            )}
        </div>
    )
}

export default Main;
