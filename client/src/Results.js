import './Results.css';
import CardOfTheDay from "./CardOfTheDay"
import CardSearch from "./CardSearch"
import sadpikachu from "C:/Users/123ke/OneDrive/Documents/Projects/react-app/client/src/sadpikachu.jpg"
import { useNavigate } from 'react-router-dom';
function Results({ returnResults, setReturnClicked}) {
    const navigate = useNavigate();
    const placeholderImage = "https://fakeimg.pl/734x1024?text=No+Image";
    let content;
    let noResults;
    const handleItemClick = (item) => {
        setReturnClicked([item.name, item.rarity, item.set, item.number]);
        navigate(`/item/${item.name + "+" + item.rarity + "+" + item.set + "+" + item.number}`);
      };

    try {
        content = returnResults.map((item, index) => (
            <div
            key = {index} className = "results_box" 
            onClick = {() => handleItemClick(item)}>
                <div className = "results_art">
                    <img
                        src = {item.image}
                        alt = "card image"
                        className = "results_image"
                        onError = {(e) => e.target.src = placeholderImage}
                    />
                </div>
                <div className = "results_stats">
                    <div className = "text-black text-xl mt-4 tracking-wider text-center font-bold">{item.name}</div>
                    <div className = "text-gray-500 text-base tracking-wider text-center">{item.rarity}</div>
                    <div className = "text-gray-500 text-base tracking-wider text-center">{item.set}</div>
                    <div className = "text-gray-500 text-base tracking-wider text-center">{"#" + item.number}</div>
                </div>
            </div>
        ));
        noResults = <></>
    } catch (error) {
        content = <></>;
        noResults = (
            <div className = "text-center text-black p-8 flex flex-col justify-center items-center">
                <img src = {sadpikachu} alt = "No Results" className = "mb-4 "/>
                <span className = "text-black font-semibold text-4xl mb-3">No Results :(</span>
                <p className = "text-gray-600 text-2xl">Try searching for something else.</p>
            </div>
        )
    }
    return (
        <div className = "results_component">
            <div className = "results_title">
                Search Results
            </div>
            {noResults}
            <div className = "results_content">
                {content}
            </div>
        </div>
    );
}


export default Results;