import React from 'react';
import Routes from './client/routes';
import { BrowserRouter } from "react-router-dom";
import Game from './client/components/pages/Game/Game';
import './App.css';

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
