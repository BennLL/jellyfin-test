import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MediaDetail from "./mediaDetails";
import ShowDetails from "./ShowDetails";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/media/:id" element={<MediaDetail />} />
        <Route path="/show/:id" element={<ShowDetails />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();