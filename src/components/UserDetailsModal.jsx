import React from "react";
import { createPortal } from "react-dom";
import styles from "../styles/UserDetailsModal.module.css";

export default function UserDetailsModal({ user, loading, onClose }) {
  // Only render modal if loading or user exists
  if (!user && !loading) return null;

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {loading ? (
          <div className={styles.loader}>Loading user details...</div>
        ) : (
          <>
            <h2>User Details</h2>
            <div className={styles.detailsRow}>
              <strong>ID:</strong> <span>{user.id || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>First Name:</strong> <span>{user.firstName || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Last Name:</strong> <span>{user.lastName || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Email:</strong> <span>{user.email || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Phone:</strong> <span>{user.phoneNumber || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Gender:</strong> <span>{user.gender || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Date of Birth:</strong>{" "}
              <span>{user.dateOfBirth || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>ID Number:</strong> <span>{user.idNumber || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Identification Type:</strong>{" "}
              <span>{user.identificationType || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Role(s):</strong>{" "}
              <span>
                {user.roleHashSet?.map((r) => r.roleType).join(", ") || "-"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}