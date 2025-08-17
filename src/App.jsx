import React from "react";
import Home from "./pages/Home";
import Timetable from "./pages/Timetable";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/globals.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timetable" element={<Timetable />} />
    

      </Routes>
    </Router>
  );
}

export default App;
