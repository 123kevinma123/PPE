import { useEffect, useState } from 'react';
import './Main.css';
import "./Search.css"

function Search() {
    const [searchResult, setSearchResult] = useState("");

    const handleInputChange = (event) => {
        setSearchResult(event.target.value);
    };
    const handelSubmit = (event) => {
        event.preventDefault();

        setSearchResult("");
    }

    return (
        <div className = "search_component">
            <div className = "search_bar">
                <input className = "search_input" type = "text" value = {searchResult} onChange = {handleInputChange} placeholder = "Search Pokemon" />  
            </div>
        </div>
    )
}

export default Search;