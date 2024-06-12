import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import "./Search.css"

function Search({setReturnResults}) {
    const [searchResult, setSearchResult] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setSearchResult(event.target.value);
        
    };
    function handleSubmit(event) {
        if (event.key === "Enter") {
            //navigate(`/search?query=${encodeURIComponent(searchResult)}`);
            event.preventDefault();
            sendToBackend(searchResult);
            setSearchResult("");
        }
    }
    function sendToBackend(result) {
        fetch("http://localhost:1234/search", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                result
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("Data received from server:", data);
            setReturnResults(data);
        });
    }
    return (
        <div className = "search_component">
            <div className = "search_bar">
                <input className = "search_input" type = "text" value = {searchResult} onChange = {handleInputChange}
                onKeyDown = {handleSubmit} placeholder = "Search Pokemon"/>  
            </div>
        </div>
    )
}

export default Search;