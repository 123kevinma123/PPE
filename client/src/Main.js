import './Main.css';
import CardOfTheDay from "./CardOfTheDay"
import CardSearch from "./CardSearch"
function Main() {
    return (
        <div className = "wrapper">
            <div className = "nav_bar">
                <div className = "title">
                    Graded Pokemon Price Estimator
                </div>
            </div>
            <div className = "search_component">
                <div className = "search_bar">
                    <div className = "search_input">
                        Search Pokemon
                    </div>
                </div>
            </div>
            <CardOfTheDay />
            <CardSearch />
        </div>
    )
}

export default Main;
