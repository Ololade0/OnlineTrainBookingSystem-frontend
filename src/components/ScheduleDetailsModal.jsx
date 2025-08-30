import React from "react";
import { createPortal } from "react-dom";
import styles from "../styles/ScheduleList.module.css";

export default function ScheduleDetailsModal({ schedule, onClose }) {
  if (!schedule) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Schedule Details</h2>
        <table>
          <tbody>
            <tr><td>Route:</td><td>{schedule.route}</td></tr>
            <tr><td>Bus:</td><td>{schedule.bus}</td></tr>
            <tr><td>Schedule Type:</td><td>{schedule.scheduleType}</td></tr>
            <tr><td>Departure:</td><td>{schedule.departureDate} {schedule.departureTime}</td></tr>
            <tr><td>Arrival:</td><td>{schedule.arrivalDate} {schedule.arrivalTime}</td></tr>
          </tbody>
        </table>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}
