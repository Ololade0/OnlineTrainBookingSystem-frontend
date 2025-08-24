
// import React, { useEffect, useState } from "react";
// import StationForm from "./StationForm";
// import styles from "../styles/StationList.module.css";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/AuthContext";

// const StationList = () => {
//   const { auth } = useAuth();
//   const [stations, setStations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [selectedStation, setSelectedStation] = useState(null);
//   const [activeMenu, setActiveMenu] = useState(null); // 3-dot menu state

//   const fetchStations = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${process.env.REACT_APP_API}/station/get-all-station?page=0&size=10`, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//         },
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || `Failed to fetch stations: ${res.status}`);
//       }

//       const data = await res.json();
//       setStations(data.content || []);
//     } catch (err) {
//       toast.error(err.message || "Error fetching stations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStations();
//   }, []);

//   const handleMenuToggle = (stationId) => {
//     setActiveMenu(activeMenu === stationId ? null : stationId);
//   };

//   const handleEdit = (station) => {
//     setSelectedStation(station);
//     setShowForm(true);
//     setActiveMenu(null);
//   };

//   const handleDelete = (stationId) => {
//     toast.info(`Delete station ${stationId} (implement API call)`);
//     setActiveMenu(null);
//   };

//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
//         <h2>Stations</h2>
//         <button className={styles["submit-btn"]} onClick={() => setShowForm(true)}>
//           Add Station
//         </button>
//       </div>

//       {loading ? (
//         <p>Loading stations...</p>
//       ) : stations.length === 0 ? (
//         <p>No stations available</p>
//       ) : (
//         <table className={styles.stationTable}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Code</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {stations.map((station) => (
//               <tr key={station.stationId}>
//                 <td>{station.stationName}</td>
//                 <td>{station.stationCode}</td>
//                 <td style={{ position: "relative" }}>
//                   <button onClick={() => handleMenuToggle(station.stationId)}>⋮</button>
//                   {activeMenu === station.stationId && (
//                     <div className={styles.actionMenu}>
//                       <button onClick={() => handleEdit(station)}>Edit</button>
//                       <button onClick={() => toast.info(JSON.stringify(station))}>View</button>
//                       <button onClick={() => handleDelete(station.stationId)}>Delete</button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {showForm && (
//         <StationForm
//           station={selectedStation}
//           onClose={() => {
//             setShowForm(false);
//             setSelectedStation(null);
//             fetchStations();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default StationList;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/StationForm.module.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const StationForm = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Get stationId from URL for editing
  const [formData, setFormData] = useState({
    stationName: "",
    stationCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [station, setStation] = useState(null);

  // Fetch station data if editing
  useEffect(() => {
    if (id) {
      const fetchStation = async () => {
        try {
          const res = await fetch(`${API_BASE}/station/get-station/${id}`, {
            headers: {
              "Content-Type": "application/json",
              ...(auth?.token && { Authorization: `Bearer ${auth.token}` }),
            },
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.status?.description || "Failed to fetch station");
          setStation(data);
          setFormData({
            stationName: data.stationName || "",
            stationCode: data.stationCode || "",
          });
        } catch (err) {
          toast.error(err.message);
        }
      };
      fetchStation();
    }
  }, [id, auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = id
        ? `${API_BASE}/station/update-station/${id}`
        : `${API_BASE}/station/create-station`;
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(auth?.token && { Authorization: `Bearer ${auth.token}` }),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.status?.description || "Failed to save station");
      toast.success(id ? "Station updated successfully" : "Station created successfully");
      navigate("/stations");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>{id ? "Edit Station" : "Add New Station"}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="stationName">
            Station Name
          </label>
          <input
            className={styles.input}
            type="text"
            id="stationName"
            name="stationName"
            value={formData.stationName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="stationCode">
            Station Code
          </label>
          <input
            className={styles.input}
            type="text"
            id="stationCode"
            name="stationCode"
            value={formData.stationCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.submitButton}
            onClick={() => navigate("/stations")}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Saving..." : id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StationForm;