// // export default StationForm;
// import React, { useState } from "react";
// import styles from "../styles/StationForm.module.css";
// import { toast } from "react-toastify";

// const API_BASE = process.env.REACT_APP_API;

// const StationForm = ({ onClose }) => {
//   const [name, setName] = useState("");
//   const [location, setLocation] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/station/create-station`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, location }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         // show backend error directly
//         throw new Error(data.message || "Error creating station");
//       }

//       toast.success("Station created successfully!");
//       onClose(); // close form after success
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.formContainer}>
//       <h2 className={styles.formTitle}>Add Station</h2>
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>Station Name</label>
//           <input
//             className={styles.input}
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>Location</label>
//           <input
//             className={styles.input}
//             type="text"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             required
//           />
//         </div>
//         <button
//           className={styles.submitButton}
//           type="submit"
//           disabled={loading}
//         >
//           {loading ? "Creating..." : "Create Station"}
//         </button>
//         <button
//           type="button"
//           className={styles.submitButton}
//           style={{ marginTop: "0.5rem", background: "#ccc", color: "#000" }}
//           onClick={onClose}
//         >
//           Cancel
//         </button>
//       </form>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import StationForm from "./StationForm";
import styles from "../styles/StationList.module.css";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const StationList = () => {
  const { auth } = useAuth();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null); // 3-dot menu state

  const fetchStations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API}/station/get-all-station?page=0&size=10`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Failed to fetch stations: ${res.status}`);
      }

      const data = await res.json();
      setStations(data.content || []);
    } catch (err) {
      toast.error(err.message || "Error fetching stations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleMenuToggle = (stationId) => {
    setActiveMenu(activeMenu === stationId ? null : stationId);
  };

  const handleEdit = (station) => {
    setSelectedStation(station);
    setShowForm(true);
    setActiveMenu(null);
  };

  const handleDelete = (stationId) => {
    toast.info(`Delete station ${stationId} (implement API call)`);
    setActiveMenu(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2>Stations</h2>
        <button className={styles["submit-btn"]} onClick={() => setShowForm(true)}>
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
              <th>Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => (
              <tr key={station.stationId}>
                <td>{station.stationName}</td>
                <td>{station.stationCode}</td>
                <td style={{ position: "relative" }}>
                  <button onClick={() => handleMenuToggle(station.stationId)}>⋮</button>
                  {activeMenu === station.stationId && (
                    <div className={styles.actionMenu}>
                      <button onClick={() => handleEdit(station)}>Edit</button>
                      <button onClick={() => toast.info(JSON.stringify(station))}>View</button>
                      <button onClick={() => handleDelete(station.stationId)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <StationForm
          station={selectedStation}
          onClose={() => {
            setShowForm(false);
            setSelectedStation(null);
            fetchStations();
          }}
        />
      )}
    </div>
  );
};

export default StationList;
