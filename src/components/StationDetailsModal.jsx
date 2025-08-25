
// import React from "react";
// import styles from "../styles/StationList.module.css";

// const StationDetailsModal = ({ station, onClose }) => {
//   if (!station) return null;

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         {/* Header with Title + Close Button */}
//         <div className={styles.modalHeader}>
//           <h3 className={styles.modalTitle}>Station Details</h3>
//           <button className={styles.iconButton} onClick={onClose}>
//             &times; {/* simple X symbol */}
//           </button>
//         </div>

//         <div className={styles.modalBody}>
//           <p>
//             <strong>Name:</strong> {station.stationName}
//           </p>
//           <p>
//             <strong>Code:</strong> {station.stationCode}
//           </p>
//           {/* Add more station fields here if needed */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StationDetailsModal;


import React from "react";
import { createPortal } from "react-dom";
import styles from "../styles/StationDetailsModal.module.css";

export default function StationDetailsModal({ station, loading, onClose }) {
  // Only render modal if loading or station exists
  if (!station && !loading) return null;

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
          <div className={styles.loader}>Loading station details...</div>
        ) : (
          <>
            <h2>Station Details</h2>

            <div className={styles.detailsRow}>
              <strong>ID:</strong> <span>{station.stationId || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Station Name:</strong>{" "}
              <span>{station.stationName || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Station Code:</strong>{" "}
              <span>{station.stationCode || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Created At:</strong>{" "}
              <span>{station.createdAt || "-"}</span>
            </div>
            <div className={styles.detailsRow}>
              <strong>Updated At:</strong>{" "}
              <span>{station.updatedAt || "-"}</span>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
