import './Results.css';
import CardOfTheDay from "./CardOfTheDay"
import CardSearch from "./CardSearch"
function Results({returnResults}) {
    return (
        <div className = "results_component">
            {/* gonna be replaced with a key thing so its consistent */}
            <div className = "results_title">
                Search Results
            </div>
            <div className = "results_content">
                {
                    returnResults.map((item, index) => (
                        <div className = "results_box" key = {index}>
                            <div className = "results_art">
                                <img src = {item.image} alt = "card image" className = "results_image"></img>
                            </div>
                            <div className = "results_stats">
                                {item.name}
                                <br />
                                {item.set}
                                <br />
                                {item.number}
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default Results;