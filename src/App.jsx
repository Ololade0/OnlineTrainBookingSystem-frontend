

import React from "react";
import Home from "./pages/Home";
import Timetable from "./pages/Timetable";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // superadmin dashboard
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/globals.css";

import { AuthProvider } from "./context/AuthContext"; // ✅ NEW

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Superadmin */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
