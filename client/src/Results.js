import './Results.css';
import CardOfTheDay from "./CardOfTheDay"
import CardSearch from "./CardSearch"
function Results({ returnResults }) {
    const placeholderImage = "https://fakeimg.pl/734x1024?text=No+Image";
    let content;

    try {
        content = returnResults.map((item, index) => (
            <div className = "results_box" key={index}>
                <div className = "results_art">
                    <img
                        src = {item.image}
                        alt = "card image"
                        className = "results_image"
                        onError = {(e) => e.target.src = placeholderImage}
                    />
                </div>
                <div className = "results_stats">
                    {item.name}
                    <br />
                    {item.set}
                    <br />
                    {item.number}
                </div>
            </div>
        ));
    } catch (error) {
        content = <div className = "no_results" />;
    }

    return (
        <div className = "results_component">
            <div className = "results_title">
                Search Results
            </div>
            <div className = "results_content">
                {content}
            </div>
        </div>
    );
}


export default Results;