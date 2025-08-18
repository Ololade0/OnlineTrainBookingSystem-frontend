// import React, { useState } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import styles from "../styles/Timetable.module.css";

// const Timetable = () => {
//   // Available enum routes (exact values from backend)
//   const routes = [
//     "LAGOS_IBADAN_MORNING_TRAIN",
//     "LAGOS_IBADAN_AFTERNOON_TRAIN",
//     "IBADAN_LAGOS_MORNING_TRAIN",
//     "ABUJA_KADUNA_MORNING_TRAIN",
//     "IBADAN_LAGOS_AFTERNOON_TRAIN"
//   ];

//   const [selectedRoute, setSelectedRoute] = useState("");
//   const [schedules, setSchedules] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Fetch schedules from backend
//   const fetchSchedules = async () => {
//     if (!selectedRoute) {
//       setError("Please select a route first."); // Alert if no route selected
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setSchedules([]);

//     const url = `${process.env.REACT_APP_API_BASE_URL}/schedule/schedule-route?route=${selectedRoute}`;
//     console.log("Fetching from:", url); // DEBUG: logs URL being called

//     try {
//       const response = await fetch(url);

//       // Handle non-200 responses
//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(`Server error: ${response.status} ${response.statusText}\nResponse: ${text}`);
//       }

//       // Handle non-JSON responses
//       const contentType = response.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         const text = await response.text();
//         throw new Error("Server did not return JSON. Response: " + text);
//       }

//       const data = await response.json();

//       // Handle empty array (no schedules found)
//       if (!Array.isArray(data) || data.length === 0) {
//         setError("No schedules found for this route.");
//         return;
//       }

//       // Success: set fetched schedules
//       setSchedules(data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError(err.message || "Something went wrong while fetching schedules.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.pageWrapper}>
//       {/* Header */}
//       <Header />

//       {/* Hero Section */}
//       <section className={styles.hero}>
//         <h1>Train Timetable 🚆</h1>
//         <p>View available schedules by route</p>
//       </section>

//       {/* Dropdown + Button */}
//       <div className={styles.controls}>
//         <label htmlFor="route">Select a Route:</label>
//         <select
//           id="route"
//           value={selectedRoute}
//           onChange={(e) => setSelectedRoute(e.target.value)}
//         >
//           <option value="">-- Choose a route --</option>
//           {routes.map((route, idx) => (
//             <option key={idx} value={route}>
//               {route}
//             </option>
//           ))}
//         </select>
//         <button onClick={fetchSchedules}>View Schedule</button>
//       </div>

//       {/* Alerts */}
//       {loading && <div className={styles.info}>Loading schedules...</div>}
//       {error && <div className={styles.error}>{error}</div>}

//       {/* Table */}
//       {schedules.length > 0 && (
//         <div className={styles.tableContainer}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 {Object.keys(schedules[0]).map((key) => (
//                   <th key={key}>{key}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {schedules.map((schedule) => (
//                 <tr key={schedule.id}>
//                   {Object.values(schedule).map((value, idx) => (
//                     <td key={idx}>{value}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default Timetable;


import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Timetable.module.css";

const Timetable = () => {
  // List of routes exactly as defined in backend
  const routes = [
    "LAGOS_IBADAN_MORNING_TRAIN",
    "LAGOS_IBADAN_AFTERNOON_TRAIN",
    "IBADAN_LAGOS_MORNING_TRAIN",
    "ABUJA_KADUNA_MORNING_TRAIN",
    "IBADAN_LAGOS_AFTERNOON_TRAIN"
  ];

  const [selectedRoute, setSelectedRoute] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch schedules from backend
  const fetchSchedules = async () => {
    if (!selectedRoute) {
      setError("Please select a route first."); // Alert if no route selected
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors
    setSchedules([]); // Clear previous schedules

    const url = `${process.env.REACT_APP_API_BASE_URL}/schedule/schedule-route?route=${selectedRoute}`;
    console.log("Fetching from:", url); // DEBUG: log URL being called

    try {
      const response = await fetch(url);

      // ✅ Handle 404 specifically to show user-friendly message
      if (response.status === 404) {
        setError("No schedules found for this route.");
        return;
      }

      // Handle other non-200 responses
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} ${response.statusText}\nResponse: ${text}`);
      }

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Server did not return JSON. Response: " + text);
      }

      const data = await response.json();

      // Success: set fetched schedules
      setSchedules(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Something went wrong while fetching schedules.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Train Timetable 🚆</h1>
        <p>View available schedules by route</p>
      </section>

      {/* Dropdown + Button */}
      <div className={styles.controls}>
        <label htmlFor="route">Select a Route:</label>
        <select
          id="route"
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
        >
          <option value="">-- Choose a route --</option>
          {routes.map((route, idx) => (
            <option key={idx} value={route}>
              {route}
            </option>
          ))}
        </select>
        <button onClick={fetchSchedules}>View Schedule</button>
      </div>

      {/* Alerts */}
      {loading && <div className={styles.info}>Loading schedules...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {/* Table */}
      {schedules.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {Object.keys(schedules[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  {Object.values(schedule).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Timetable;
