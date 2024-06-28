import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Main from './Main';
import ItemPage from './ItemPage';

function App() {
  const [returnResults, setReturnResults] = useState([]);
  const [returnClicked, setReturnClicked] = useState([]);
  const [isEntered, setIsEntered] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handlePopState = () => {
        window.location.reload(); // Force reload the page
    };

    window.addEventListener("popstate", handlePopState);

    // Clean up the event listener on component unmount
    return () => {
        window.removeEventListener("popstate", handlePopState);
    };  
  }, []);
  return (
    <Routes>
      <Route
        path = "/home/"
        element=  {
          <Main
            returnResults = {returnResults}
            setReturnResults = {setReturnResults}
            returnClicked = {returnClicked}
            setReturnClicked = {setReturnClicked}
            isEntered = {isEntered}
            setIsEntered = {setIsEntered}
          />
        }
      />
      <Route
        path = "/search/:id"
        element=  {
          <Main
            returnResults = {returnResults}
            setReturnResults = {setReturnResults}
            returnClicked = {returnClicked}
            setReturnClicked = {setReturnClicked}
            isEntered = {isEntered}
            setIsEntered = {setIsEntered}
          />
        }
      />
      <Route
        path = "/item/:id"
        element = {
        <ItemPage 
        setReturnClicked = {setReturnClicked} 
        returnClicked = {returnClicked} 
        isEntered = {isEntered}
        setIsEntered = {setIsEntered}/>}
      />
    </Routes>
  );
}

export default App;