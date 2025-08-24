// export default App;
import React from "react";
import Home from "./pages/Home";
import Timetable from "./pages/Timetable";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StationList from "./components/StationList";
import StationForm from "./components/StationForm"; // 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/globals.css";

import { AuthProvider } from "./context/AuthContext"; // ✅ NEW
import { ToastContainer } from "react-toastify"; // ✅ Toastify import
import "react-toastify/dist/ReactToastify.css"; // ✅ Toastify styles

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/login" element={<Login />} />
          <Route path="/stations" element={<StationList />} />
          <Route path="/stations/new" element={<StationForm />} />
          <Route path="/stations/edit/:id" element={<StationForm />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Superadmin */}
        </Routes>
      </Router>

      {/* ✅ Toast container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App;
