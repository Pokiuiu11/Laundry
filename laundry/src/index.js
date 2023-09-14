import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route,} from 'react-router-dom';
import Home from './Home';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="home" element={<Home />} />

    </Routes>
  </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

