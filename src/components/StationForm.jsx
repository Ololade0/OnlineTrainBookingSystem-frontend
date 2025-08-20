// // src/components/StationForm.jsx
// import React, { useState } from "react";
// import { useAuth } from "../context/AuthContext"; // ✅ ensures user is authenticated
// import { toast } from "react-toastify";
// import styles from "../styles/StationForm.module.css";

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// const StationForm = () => {
//   const { auth } = useAuth();
//   const [station, setStation] = useState({
//     stationCode: "",
//     stationName: "",
//   });

//   const [loading, setLoading] = useState(false);

//   // Simple frontend validation
//   const validateForm = () => {
//     const errors = {};
//     if (!station.stationCode.trim()) errors.stationCode = "Station code is required";
//     if (!station.stationName.trim()) errors.stationName = "Station name is required";
//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!auth?.token) {
//       toast.error("You must be logged in to create a station!");
//       return;
//     }

//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       for (const err in errors) toast.error(errors[err]);
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${API_BASE}/create-station`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`, // ✅ auth required
//         },
//         body: JSON.stringify(station),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success(data.message || "Station created successfully!");
//         setStation({ stationCode: "", stationName: "" }); // reset form
//       } else {
//         toast.error(data.message || "Failed to create station");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "500px", margin: "0 auto" }}>
//       <h2>Create New Station</h2>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: "1rem" }}>
//           <label>Station Code:</label>
//           <input
//             type="text"
//             value={station.stationCode}
//             onChange={(e) => setStation({ ...station, stationCode: e.target.value })}
//           />
//         </div>

//         <div style={{ marginBottom: "1rem" }}>
//           <label>Station Name:</label>
//           <input
//             type="text"
//             value={station.stationName}
//             onChange={(e) => setStation({ ...station, stationName: e.target.value })}
//           />
//         </div>

//         <button type="submit" disabled={loading}>
//           {loading ? "Creating..." : "Create Station"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default StationForm;

// src/components/StationForm.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ ensures user is authenticated
import { toast } from "react-toastify";
import styles from "../styles/StationForm.module.css"; // ✅ CSS Module import

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const StationForm = () => {
  const { auth } = useAuth();
  const [station, setStation] = useState({
    stationCode: "",
    stationName: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Frontend validation
  const validateForm = () => {
    const errors = {};
    if (!station.stationCode.trim()) errors.stationCode = "Station code is required";
    if (!station.stationName.trim()) errors.stationName = "Station name is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth?.token) {
      toast.error("You must be logged in to create a station!");
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((err) => toast.error(err));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/create-station`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`, // ✅ auth required
        },
        body: JSON.stringify(station),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Station created successfully!");
        setStation({ stationCode: "", stationName: "" }); // ✅ reset form
      } else {
        toast.error(data.message || "Failed to create station");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}> {/* ✅ CSS Module usage */}
      <h2 className={styles.formTitle}>Create New Station</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Station Code:</label>
          <input
            type="text"
            value={station.stationCode}
            onChange={(e) => setStation({ ...station, stationCode: e.target.value })} // ✅ fixed spread syntax
            className={styles.input}
            placeholder="Enter station code"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Station Name:</label>
          <input
            type="text"
            value={station.stationName}
            onChange={(e) => setStation({ ...station, stationName: e.target.value })} // ✅ fixed spread syntax
            className={styles.input}
            placeholder="Enter station name"
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Creating..." : "Create Station"}
        </button>
      </form>
    </div>
  );
};

export default StationForm;
