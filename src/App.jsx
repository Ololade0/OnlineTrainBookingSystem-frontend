// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import Home from "./pages/Home";
// import Timetable from "./pages/Timetable";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Unauthorized from "./pages/Unauthorized"; // 🔹 create this page
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute"; // 🔹 use the updated version
// import DasbhBoardLayout from "./components/DashboardLayout"; 

// import "./styles/globals.css";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/timetable" element={<Timetable />} />
//           <Route path="/login" element={<Login />} />

//           {/* 🔐 Protected Dashboard Route */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute requiredRole="SUPERADMIN_ROLE">
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* 🚫 Unauthorized route */}
//           <Route path="/unauthorized" element={<Unauthorized />} />
//         </Routes>
//       </Router>

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </AuthProvider>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Timetable from "./pages/Timetable";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout"; // ✅ fixed import name

import "./styles/globals.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/login" element={<Login />} />

          {/* 🔐 Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="SUPERADMIN_ROLE">
                <DashboardLayout />
              </ProtectedRoute>
            }
          />

          {/* 🚫 Unauthorized route */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Catch-all → redirect unauthorized users */}
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </Router>

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
