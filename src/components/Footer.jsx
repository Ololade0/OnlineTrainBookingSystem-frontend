import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      © 2025 Ololade TrainBooking Inc. | 
      <a href="/terms"> Terms</a> | 
      <a href="/privacy"> Privacy</a>
    </footer>
  );
};

export default Footer;
