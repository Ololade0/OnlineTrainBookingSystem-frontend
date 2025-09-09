

import React from "react";
import { createPortal } from "react-dom";
import styles from "../styles/TrainDetailsModal.module.css";

export default function TrainDetailsModal({ train, loading, onClose }) {
 
  if (!train && !loading) return null;

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
          <div className={styles.loader}>Loading train details...</div>
        ) : (
          <>
            <h2>Train Details</h2>

            <div className={styles.detailsRow}>
              <strong>ID:</strong> <span>{train.trainId || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Train Name:</strong>{" "}
              <span>{train.trainName || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Train Code:</strong>{" "}
              <span>{train.trainCode || "-"}</span>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
