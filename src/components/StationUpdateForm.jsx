import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "../styles/StationUpdateForm.module.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function StationUpdateForm({ station, onBack, onSuccess }) {
  const [stationName, setStationName] = useState(station.stationName);
  const [stationCode, setStationCode] = useState(station.stationCode);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stationName || !stationCode) {
      toast.error("Station Name and Code are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/station/update-station/${station.stationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${station.token}`, // use auth token if needed
        },
        body: JSON.stringify({ stationName, stationCode }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update station");

      toast.success(data.message || "Station updated successfully!");
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Update Station</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Station Name
          <input
            type="text"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            required
          />
        </label>
        <label>
          Station Code
          <input
            type="text"
            value={stationCode}
            onChange={(e) => setStationCode(e.target.value)}
            required
          />
        </label>
        <div className={styles.buttons}>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
          <button type="button" onClick={onBack} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
