import { useEffect, useState } from 'react';
import Chart from "chart.js/auto";
import "./ItemPage.css";
import { Line } from "react-chartjs-2";
const labels = ["January", "February", "March", "April", "May", "June"];

const HistoricGraph = ({searchResultsWatchCount}) => {
    const [time, setTime] = useState([]);
    const [price, setPrice] = useState([]);
    setPrice(searchResultsWatchCount.Price);
    const data = {
        labels: labels,
        datasets: [
            {
            label: "Historical Data Trends",
            backgroundColor: "black",
            borderColor: "black",
            data: [0, 10, 5, 2, 20, 30, 45],
            },
        ],
    };
    return (
        <div className = "historic_Graph">
            <Line data = {data} />
        </div>
    );
};
export default HistoricGraph;