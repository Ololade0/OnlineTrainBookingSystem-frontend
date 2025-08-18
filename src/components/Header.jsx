// import React from "react";
// import styles from "../styles/Header.module.css";

// const Header = () => {
//   return (
//     <header className={styles.header}>
//       <div className={styles.logo}>Ololade TrainBooking</div>
//       <nav className={styles.nav}>
//         <a href="/">Home</a>
//         <a href="/timetable">Train Timetable</a>
//         <a href="/login">Login</a>
//         <a href="/bookings">My Bookings</a>
//         <a href="/register">Register</a>
//       </nav>
//     </header>
//   );
// };

// export default Header;

import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ user }) => {
  const navigate = useNavigate();
  return (
    <header style={{ padding: "1rem", background: "#f0f0f0" }}>
      <h2>TrainBooking</h2>
      <nav>
        {user ? (
          <span>Welcome, {user.firstName}</span>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
