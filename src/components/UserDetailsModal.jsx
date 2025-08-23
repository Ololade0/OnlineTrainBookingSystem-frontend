import React from "react";
import { createPortal } from "react-dom";
import styles from "../styles/UserDetailsModal.module.css";

export default function UserDetailsModal({ user, loading, onClose }) {
  // Always render modal if loading or user exists
  if (!user && !loading) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        {loading ? (
          <div className={styles.loader}>Loading user details...</div>
        ) : (
          <>
            <h2>User Details</h2>
            <div><strong>ID:</strong> {user.id}</div>
            <div><strong>Name:</strong> {user.lastName} {user.firstName}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Phone:</strong> {user.phoneNumber || "-"}</div>
            <div><strong>Gender:</strong> {user.gender || "-"}</div>
            <div><strong>Roles:</strong> {user.roleHashSet?.map(r => r.roleType).join(", ") || "-"}</div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
