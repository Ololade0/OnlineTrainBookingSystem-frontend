import React from "react";
import styles from "../styles/Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Ololade TrainBooking</div>
      <nav className={styles.nav}>
        <a href="/">Home</a>
        <a href="/timetable">Train Timetable</a>
        <a href="/bookings">My Bookings</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </nav>
    </header>
  );
};

export default Header;

