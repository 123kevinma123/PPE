import './Main.css';
import CardOfTheDay from "./CardOfTheDay"
import CardSearch from "./CardSearch"
import Results from "./Results"
import Search from "./Search"
function Main() {
    return (
        <div className = "wrapper">
            <div className = "nav_bar">
                <div className = "title">
                    Graded Pokemon Price Estimator
                </div>
            </div>
            <Search />
            { /* <CardOfTheDay /> */}
            { /* <CardSearch /> */}
            <Results />
        </div>
    )
}

export default Main;
