// src/pages/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Unauthorized.module.css";

export default function Unauthorized() {
  return (
    <div className={styles.container}>
      <h1>🚫 Unauthorized Access</h1>
      <p>You don’t have permission to view this page.</p>
      <Link to="/" className={styles.homeButton}>
        ⬅ Back to Home
      </Link>
    </div>
  );
}
