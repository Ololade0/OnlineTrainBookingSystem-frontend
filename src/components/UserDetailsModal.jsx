// components/UserDetailsModal.jsx
import React from "react";
import styles from "../styles/StaffList.module.css";

export default function UserDetailsModal({ user, loading, onClose }) {
  if (!user && !loading) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.modalClose} onClick={onClose}>×</button>
        {loading ? (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <>
            <h2>User Details</h2>
            <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phoneNumber || "-"}</p>
            <p><strong>Gender:</strong> {user.gender || "-"}</p>
            <p><strong>Roles:</strong> {user.roleHashSet?.map(r => r.roleType).join(", ") || "-"}</p>
          </>
        )}
      </div>
    </div>
  );
}
