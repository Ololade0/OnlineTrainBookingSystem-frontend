// src/components/Header.jsx
import React from "react";
import styles from "../styles/Header.module.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get first letter of email (uppercase) for avatar
  const userInitial = auth?.email ? auth.email.charAt(0).toUpperCase() : "";

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Ololade TrainBooking</div>
      <nav className={styles.nav}>
        <a href="/">Home</a>
        <a href="/timetable">Train Timetable</a>
        <a href="/bookings">My Bookings</a>

        {!auth?.token ? (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        ) : (
          <>

                  {/* Only show Dashboard link if SUPERADMIN_ROLE */}
        {auth.roles?.includes("SUPERADMIN_ROLE") && (
          <a href="/dashboard">Dashboard</a>
        )}

               <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
            {/* Avatar Circle */}
            <div className={styles.avatar}>{userInitial}</div>
            

            {/* {auth.roles?.includes("SUPERADMIN_ROLE") && (
              <a href="/admin/dashboard">Admin Dashboard</a>
            )} */}

       
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
