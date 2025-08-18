// import React from "react";
// import Home from "./pages/Home";
// import Timetable from "./pages/Timetable";
// import Login from "./pages/Login";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./styles/globals.css";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/timetable" element={<Timetable />} />
//         <Route path="/login" element={<Login />} />

    

//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Header from "./components/Header";

function App() {
  const [user, setUser] = useState(null); // store logged-in user

  return (
    <Router>
      <Header user={user} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        //         <Route path="/timetable" element={<Timetable />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
