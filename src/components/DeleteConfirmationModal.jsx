import React from "react";
import { createPortal } from "react-dom";
import styles from "../styles/DeleteConfirmation.module.css"; // Replace with your CSS path

/**
 * Reusable Delete Confirmation Modal
 * Props:
 *  - isOpen: boolean, controls visibility
 *  - title: string, modal title
 *  - message: string, modal message
 *  - confirmText: string, confirm button text
 *  - cancelText: string, cancel button text
 *  - onConfirm: function, called when confirm button clicked
 *  - onCancel: function, called when cancel button clicked
 *  - loading: boolean, disables buttons and shows loading text
 */
export default function DeleteConfirmationModal({
  isOpen,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalActions}>
          <button
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
