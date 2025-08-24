// import React from "react";
// import styles from "../styles/StationList.module.css";

// export default function StationDetailsModal({ station, onClose }) {
//   if (!station) return null;

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         <button className={styles.modalClose} onClick={onClose}>×</button>
//         <h2>Station Details</h2>
//         <p><strong>Name:</strong> {station.stationName}</p>
//         <p><strong>Code:</strong> {station.stationCode}</p>
//         <p><strong>Description:</strong> {station.description || "-"}</p>
//       </div>
//     </div>
//   );
// }


import React from "react";
import styles from "../styles/StationList.module.css";

const StationDetailsModal = ({ station, onClose }) => {
  if (!station) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Station Details</h3>
        <div className={styles.modalBody}>
          <p><strong>Name:</strong> {station.stationName}</p>
          <p><strong>Code:</strong> {station.stationCode}</p>
          {/* Add more station fields if needed */}
        </div>
        <div className={styles.modalActions}>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StationDetailsModal;
