import React from 'react';
import Routes from './client/routes';
import { BrowserRouter } from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
  );
}

export default App;
