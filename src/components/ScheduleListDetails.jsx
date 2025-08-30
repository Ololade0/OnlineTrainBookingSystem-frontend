
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/ScheduleListDetails.module.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function ScheduleListDetails({ scheduleId, onClose }) {
  const { auth } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/schedule/find-schedule/${scheduleId}`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch schedule details");
        setSchedule(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchScheduleDetails();
    }
  }, [scheduleId, auth]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        {loading ? (
          <div className={styles.loader}>Loading...</div>
        ) : schedule ? (
          <div className={styles.detailsContainer}>
            <h2>Schedule Details</h2>
            <div className={styles.detailItem}>
              <span className={styles.label}>Train Name:</span>
              <span>{schedule.trainName}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Departure Station:</span>
              <span>{schedule.departueStationName}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Arrival Station:</span>
              <span>{schedule.arrivalStationName}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Departure Date:</span>
              <span>{schedule.departureDate}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Arrival Date:</span>
              <span>{schedule.arrivalDate}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Departure Time:</span>
              <span>{schedule.departureTime}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Arrival Time:</span>
              <span>{schedule выходаTime}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Duration:</span>
              <span>{schedule.duration}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Distance:</span>
              <span>{schedule.distance}</span>
            </div>
          </div>
        ) : (
          <p>No details available</p>
        )}
      </div>
    </div>
  );
}