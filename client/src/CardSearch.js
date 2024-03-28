import './Main.css';
import "./CardSearch.css"
import React, { useEffect, useState } from 'react';
import cheerio from 'cheerio';
const pretty = require("pretty");



function CardSearch() {
    const [searchResultsEbay, setSearchResultsEbay] = useState([]);
    const [searchResultsWatchCount, setSearchResultsWatchCount] = useState([]);

    useEffect(() => {
        // Fetch eBay search results from server
        fetchEbaySearchResults();
        fetchWatchCountSearchResults();
    }, []);

    const fetchEbaySearchResults = async () => {
        try {
            // Fetch eBay search results from server
            const response = await fetch('http://localhost:1234/ebay-search');
            const data = await response.json();

            // Set the fetched data as the search results state
            setSearchResultsEbay(data);
        } catch (error) {
            console.error('Error fetching eBay data:', error);
        }
    };
    const fetchWatchCountSearchResults = async () => {
        try {
            // Fetch watch count search results from server
            const response = await fetch('http://localhost:1234/watch-count-search');
            const data = await response.json();

            // Set the fetched data as the search results state
            setSearchResultsWatchCount(data);
        } catch (error) {
            console.error('Error fetching Watch Count data:', error);
        }
    };
    const totalSum = searchResultsWatchCount.reduce((sum, result) => {
        // Parse the price string to a float and add it to the sum
        return sum + parseFloat(result.price.replace(/[^\d.]/g, ''));
    }, 0);
    
    // Calculate the average price
    const averagePrice = totalSum / searchResultsWatchCount.length;
    
    // Display the average price
    console.log('Average Price:', averagePrice.toFixed(2));

    return (
        <div>
            {/* Render the fetched search results */}
            {searchResultsWatchCount.map((result, index) => (
                <div key = {index} className = "results_list">
                    <h3>{result.title}</h3>
                    <p>Price: {result.price}</p>
                    <p>Days since sale: {result.endTime}</p>
                    <a href = {result.url} target="_blank" rel="noopener noreferrer">View Item</a>
                </div>
            ))}
        </div>
    );
}
export default CardSearch;
