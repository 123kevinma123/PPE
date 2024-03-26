import './Main.css';
import "./CardSearch.css"
import React, { useEffect, useState } from 'react';
import cheerio from 'cheerio';
const pretty = require("pretty");



function CardSearch() {
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // Fetch eBay search results from server
        fetchEbaySearchResults();
    }, []);

    const fetchEbaySearchResults = async () => {
        try {
            // Fetch eBay search results from server
            const response = await fetch('http://localhost:1234/ebay-search');
            const data = await response.json();

            // Set the fetched data as the search results state
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching eBay data:', error);
        }
    };

    return (
        <div>
            {/* Render the fetched search results */}
            {searchResults.map((result, index) => (
                <div key = {index} className = "results_list">
                    <h3>{result.title}</h3>
                    <p>Price: {result.price}</p>
                    <a href = {result.url} target="_blank" rel="noopener noreferrer">View Item</a>
                </div>
            ))}
        </div>
    );
}
export default CardSearch;
