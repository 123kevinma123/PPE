import { useEffect, useState } from 'react';
import Chart from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import "./ItemPage.css";
import { Line } from "react-chartjs-2";

const HistoricGraph = ({ searchResultsWatchCount }) => {
    const [labels, setLabels] = useState([]);
    const [prices, setPrices] = useState([]);

    useEffect(() => {
        // Reverse the array
        const reversedResults = [...searchResultsWatchCount].reverse();
        const extractedPrices = reversedResults.map(result => {
            const cleanedPriceString = result.price.replace(/[$,()USD]/g, '');
            return parseFloat(cleanedPriceString); // Convert string to number
        });

        // Calculate dates based on days ago
        const calculateDate = (daysAgo) => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(daysAgo));
            return date;
        };

        const extractedTimes = searchResultsWatchCount.map(result => calculateDate(result.endTime));
        const reversedExtractedTimes = [...extractedTimes].reverse();

        setLabels(reversedExtractedTimes);
        setPrices(extractedPrices);
    }, [searchResultsWatchCount]);

    const data = {
        labels: labels,
        datasets: [
            {
                backgroundColor: "black",
                borderColor: "red",
                borderWidth: 1, 
                data: prices,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Recent Sales', 
                color: '#000',
                font: {
                    family: 'Arial',
                    size: 18,
                    weight: 'bold',
                    lineHeight: 1.2,
                },
                padding: {
                    bottom: 15 
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.parsed.y;
                        return `$${value}`;
                    },
                    title: function(context) {
                        const date = new Date(context[0].label);
                        date.setDate(date.getDate() + 1);
                        const options = { month: 'long', day: 'numeric' };
                        return date.toLocaleDateString(undefined, options);
                    }
                },
                displayColors: false,
            },
            interaction: {
                mode: 'index', // Use index mode to select based on x-axis
                intersect: false,
                axis: 'x',
            },
            hover: {
                mode: 'nearest',
                intersect: false
            }
        },
        scales: {
            x: {
                type: 'time', 
                time: {
                    unit: 'day',
                    tooltipFormat: 'MM/dd'
                },
                title: {
                    display: true,
                    text: 'Time', 
                    color: '#000',
                    font: {
                        family: 'Arial',
                        size: 14,
                        weight: 'bold',
                        lineHeight: 1.2,
                    },
                },
                grid: {
                    display: true
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Price', // Label for the Y-axis
                    color: '#000',
                    font: {
                        family: 'Arial',
                        size: 14,
                        weight: 'bold',
                        lineHeight: 1.2,
                    },
                },
                ticks: {
                    beginAtZero: true,
                    callback: function(value) {
                        return `$${value}`;
                    },
                },
            },
        },
    };

    return (
        <div className="historic_Graph">
            <Line data={data} options={options}/>
        </div>
    );
};

export default HistoricGraph;
