// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useAuth } from "../context/AuthContext";
// import styles from "../styles/ScheduleList.module.css"; 

// import { toast } from "react-toastify";

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// export default function ScheduleList() {
//   const { auth, logout } = useAuth();
//   const [schedules, setSchedules] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(0);
//   const [size] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");

//   // ✅ Fetch schedules (search + all)
//   const fetchSchedules = useCallback(async () => {
//     if (!auth?.token) {
//       toast.error("Unauthorized: No token found");
//       return;
//     }

//     setLoading(true);
//     try {
//       let url = "";
//       if (searchQuery.trim()) {
//         url = `${API_BASE}/schedule/search-schedules?query=${encodeURIComponent(
//           searchQuery
//         )}&page=${page}&size=${size}`;
//       } else {
//         url = `${API_BASE}/schedule/find-all-schedules?page=${page}&size=${size}`;
//       }

//       const response = await fetch(url, {
//         headers: { Authorization: `Bearer ${auth?.token}` },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         // ✅ throw backend error message like StationList
//         throw new Error(
//           data.message || data.status?.description || "Failed to fetch schedules"
//         );
//       }

//       setSchedules(data.content || []);
//       setTotalPages(data.totalPages || 0);
//     } catch (error) {
//       if (error.message.includes("Unauthorized") || error.message.includes("401")) {
//         toast.error("Session expired, please login again");
//         logout();
//       } else {
//         toast.error(error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [auth, page, size, searchQuery, logout]);

//   // ✅ Initial + refresh fetch
//   useEffect(() => {
//     if (auth?.token) fetchSchedules();
//   }, [auth, page, fetchSchedules]);

//   const handleSearch = () => {
//     setPage(0);
//     fetchSchedules();
//   };

//   const renderPageButtons = useMemo(() => {
//     if (totalPages === 0) return null;
//     const maxButtons = 5;
//     let start = Math.max(0, page - 2);
//     let end = Math.min(totalPages, start + maxButtons);
//     start = Math.max(0, end - maxButtons);
//     return Array.from({ length: end - start }, (_, i) => {
//       const pageIndex = start + i;
//       return (
//         <button
//           key={pageIndex}
//           className={page === pageIndex ? styles.activePage : ""}
//           onClick={() => setPage(pageIndex)}
//         >
//           {pageIndex + 1}
//         </button>
//       );
//     });
//   }, [page, totalPages]);

//   return (
//     <div className={styles.container}>
//       <div className={styles.headerRow}>
//         <h2 className={styles.title}>Schedules</h2>
//       </div>

//       <div className={styles.searchForm}>
//         <input
//           type="text"
//           placeholder="Search by Route, Station, or Bus"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//         />
//         <button onClick={handleSearch}>Search</button>
//       </div>

//       {loading ? (
//         <div className={styles.loader}>
//           <div className={styles.spinner}></div>
//         </div>
//       ) : schedules.length === 0 ? (
//         <p className={styles.empty}>No schedules found</p>
//       ) : (
//         <>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Route</th>
//                 <th>Departure Date</th>
//                  <th>Arrival Date</th>
//                 <th>Departure Time</th>
//                 <th>Arrival Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {schedules.map((schedule, index) => (
//                 <tr key={schedule.scheduleId}>
//                   <td>{page * size + index + 1}</td>
//                   <td>{schedule.route?.routeName || "N/A"}</td>
//                   <td>{schedule.bus?.plateNumber || "N/A"}</td>
//                   <td>{schedule.departureTime}</td>
//                   <td>{schedule.arrivalTime}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className={styles.pagination}>
//             <button disabled={page === 0} onClick={() => setPage(page - 1)}>
//               Previous
//             </button>
//             {renderPageButtons}
//             <button
//               disabled={page === totalPages - 1 || totalPages === 0}
//               onClick={() => setPage(page + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/ScheduleList.module.css";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function ScheduleList() {
  const { auth, logout } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [scheduleTypes, setScheduleTypes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [scheduleType, setScheduleType] = useState("");
  const [route, setRoute] = useState("");
  const [sortBy] = useState("departureDate");
  const [sortDir] = useState("desc"); // ✅ always descending

  // 🔹 Fetch dropdown data (schedule types & routes)
  const fetchFilters = useCallback(async () => {
    if (!auth?.token) return;

    try {
      const [typesRes, routesRes] = await Promise.all([
        fetch(`${API_BASE}/schedule/get-all-scheduleType`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }),
        fetch(`${API_BASE}/schedule/get-all-route`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }),
      ]);

      if (!typesRes.ok || !routesRes.ok) {
        throw new Error("Failed to fetch filters");
      }

      const typesData = await typesRes.json();
      const routesData = await routesRes.json();

      setScheduleTypes(typesData || []);
      setRoutes(routesData || []);
    } catch (err) {
      toast.error(err.message || "Error loading filters");
    }
  }, [auth]);

  // 🔹 Fetch schedules (with search + filter + sort)
  const fetchSchedules = useCallback(async () => {
    if (!auth?.token) {
      toast.error("Unauthorized: No token found");
      return;
    }

    setLoading(true);
    try {
      let url = `${API_BASE}/schedule/schedules/search?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;

      if (searchQuery.trim()) {
        url += `&query=${encodeURIComponent(searchQuery)}`;
      }
      if (scheduleType) {
        url += `&scheduleType=${encodeURIComponent(scheduleType)}`;
      }
      if (route) {
        url += `&route=${encodeURIComponent(route)}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.status?.description || "Failed to fetch schedules"
        );
      }

      setSchedules(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      if (error.message.includes("Unauthorized") || error.message.includes("401")) {
        toast.error("Session expired, please login again");
        logout();
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [auth, page, size, searchQuery, scheduleType, route, sortBy, sortDir, logout]);

  // 🔹 Load filters on mount
  useEffect(() => {
    if (auth?.token) fetchFilters();
  }, [auth, fetchFilters]);

  // 🔹 Load schedules when filters/search/page change
  useEffect(() => {
    if (auth?.token) fetchSchedules();
  }, [auth, page, fetchSchedules]);

  const handleSearch = () => {
    setPage(0);
    fetchSchedules();
  };

  const renderPageButtons = useMemo(() => {
    if (totalPages === 0) return null;
    const maxButtons = 5;
    let start = Math.max(0, page - 2);
    let end = Math.min(totalPages, start + maxButtons);
    start = Math.max(0, end - maxButtons);
    return Array.from({ length: end - start }, (_, i) => {
      const pageIndex = start + i;
      return (
        <button
          key={pageIndex}
          className={page === pageIndex ? styles.activePage : ""}
          onClick={() => setPage(pageIndex)}
        >
          {pageIndex + 1}
        </button>
      );
    });
  }, [page, totalPages]);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Schedules</h2>
      </div>

      {/* 🔹 Search + Filters */}
      <div className={styles.filterRow}>
        <input
          type="text"
          placeholder="Search by Route, Station, or Train"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />

        <select
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value)}
        >
          <option value="">All Schedule Types</option>
          {scheduleTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select value={route} onChange={(e) => setRoute(e.target.value)}>
          <option value="">All Routes</option>
          {routes.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button onClick={handleSearch}>Apply</button>
      </div>

      {loading ? (
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
        </div>
      ) : schedules.length === 0 ? (
        <p className={styles.empty}>No schedules found</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Route</th>
                <th>Departure Date</th>
                <th>Arrival Date</th>
                <th>Departure Time</th>
                <th>Arrival Time</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr key={schedule.id}>
                  <td>{page * size + index + 1}</td>
                  <td>{schedule.route || "N/A"}</td>
                  <td>{schedule.departureDate || "N/A"}</td>
                  <td>{schedule.arrivalDate || "N/A"}</td>
                  <td>{schedule.departureTime}</td>
                  <td>{schedule.arrivalTime}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            {renderPageButtons}
            <button
              disabled={page === totalPages - 1 || totalPages === 0}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
