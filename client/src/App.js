import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './Main';
import ItemPage from './ItemPage';

function App() {
  const [returnResults, setReturnResults] = useState([]);
  const [returnClicked, setReturnClicked] = useState([]);

  return (
    <Routes>
      <Route
        path = "/home/"
        element=  {
          <Main
            returnResults = {returnResults}
            setReturnResults={setReturnResults}
            returnClicked = {returnClicked}
            setReturnClicked = {setReturnClicked}
          />
        }
      />
      <Route
        path = "/item/:id"
        element = {<ItemPage setReturnClicked = {setReturnClicked} returnClicked = {returnClicked}/>}
      />
    </Routes>
  );
}

export default App;