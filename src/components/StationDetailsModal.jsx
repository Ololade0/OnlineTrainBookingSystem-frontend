
// import React from "react";
// import styles from "../styles/StationList.module.css";

// const StationDetailsModal = ({ station, onClose }) => {
//   if (!station) return null;

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         <h3 className={styles.modalTitle}>Station Details</h3>
//         <div className={styles.modalBody}>
//           <p><strong>Name:</strong> {station.stationName}</p>
//           <p><strong>Code:</strong> {station.stationCode}</p>
//           {/* Add more station fields if needed */}
//         </div>
//         <div className={styles.modalActions}>
//           <button className={styles.closeButton} onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StationDetailsModal;


import React from "react";
import styles from "../styles/StationList.module.css";

const StationDetailsModal = ({ station, onClose }) => {
  if (!station) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header with Title + Close Button */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Station Details</h3>
          <button className={styles.iconButton} onClick={onClose}>
            &times; {/* simple X symbol */}
          </button>
        </div>

        <div className={styles.modalBody}>
          <p>
            <strong>Name:</strong> {station.stationName}
          </p>
          <p>
            <strong>Code:</strong> {station.stationCode}
          </p>
          {/* Add more station fields here if needed */}
        </div>
      </div>
    </div>
  );
};

export default StationDetailsModal;
