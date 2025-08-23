import React, { useEffect, useState } from "react";
import StationForm from "./StationForm";
import styles from "../styles/StationList.module.css"; // create a new CSS or reuse form styling
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API;

const StationList = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Fetch stations from backend
  const fetchStations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/station/list`);
      if (!res.ok) throw new Error("Failed to fetch stations");
      const data = await res.json();
      setStations(data);
    } catch (err) {
      toast.error(err.message || "Error fetching stations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2>Stations</h2>
        <button
          className={styles.submitButton}
          onClick={() => setShowForm(true)}
        >
          Add Station
        </button>
      </div>

      {loading ? (
        <p>Loading stations...</p>
      ) : stations.length === 0 ? (
        <p>No stations available</p>
      ) : (
        <table className={styles.stationTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => (
              <tr key={station.id}>
                <td>{station.name}</td>
                <td>{station.location}</td>
                <td>
                  {/* Actions: Update/Delete if needed */}
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <StationForm
          onClose={() => {
            setShowForm(false);
            fetchStations(); // refresh list after adding
          }}
        />
      )}
    </div>
  );
};

export default StationList;
