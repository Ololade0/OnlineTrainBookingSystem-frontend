// import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { createPortal } from "react-dom";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import styles from "../styles/ScheduleList.module.css";
// import ScheduleForm from "./ScheduleForm";
// import ScheduleDetailsModal from "./ScheduleDetailsModal";

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// export default function ScheduleList() {
//   const { auth, logout } = useAuth();
//   const [schedules, setSchedules] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(0);
//   const [size] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [scheduleTypes, setScheduleTypes] = useState([]);
//   const [routes, setRoutes] = useState([]);
//   const [selectedScheduleType, setSelectedScheduleType] = useState("");
//   const [selectedRoute, setSelectedRoute] = useState("");
//   const [departureDate, setDepartureDate] = useState("");
//   const [arrivalDate, setArrivalDate] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [selectedSchedule, setSelectedSchedule] = useState(null);
//   const [openDropdownId, setOpenDropdownId] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//   const dropdownTriggerRefs = useRef({});
//   const dropdownMenuRef = useRef(null);

//   // Fetch schedules
//   const fetchSchedules = useCallback(async () => {
//     if (!auth?.token) return;
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (searchQuery.trim()) params.append("query", searchQuery);
//       if (selectedScheduleType) params.append("scheduleType", selectedScheduleType);
//       if (selectedRoute) params.append("route", selectedRoute);
//       if (departureDate) params.append("departureDate", departureDate);
//       if (arrivalDate) params.append("arrivalDate", arrivalDate);
//       params.append("page", page);
//       params.append("size", size);
//       params.append("sortBy", "departureDate");
//       params.append("sortDir", "desc");

//       const url = `${API_BASE}/schedule/schedules/search?${params.toString()}`;
//       const response = await fetch(url, { headers: { Authorization: `Bearer ${auth?.token}` } });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "No schedules found");

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
//   }, [auth, page, size, searchQuery, selectedScheduleType, selectedRoute, departureDate, arrivalDate, logout]);

//   // Fetch filters
//   useEffect(() => {
//     if (!auth?.token) return;
//     const fetchFilters = async () => {
//       try {
//         const [typesRes, routesRes] = await Promise.all([
//           fetch(`${API_BASE}/schedule/get-all-scheduleType`, { headers: { Authorization: `Bearer ${auth?.token}` } }),
//           fetch(`${API_BASE}/schedule/get-all-route`, { headers: { Authorization: `Bearer ${auth?.token}` } }),
//         ]);
//         const typesData = await typesRes.json();
//         const routesData = await routesRes.json();
//         setScheduleTypes(typesData || []);
//         setRoutes(routesData || []);
//       } catch (err) {
//         toast.error("Failed to load filters");
//       }
//     };
//     fetchFilters();
//   }, [auth]);

//   useEffect(() => {
//     fetchSchedules();
//   }, [fetchSchedules]);

//   const handleSearch = () => {
//     setPage(0);
//     fetchSchedules();
//   };

//   // Dropdown
//   const handleDropdownOpen = (id, event) => {
//     const rect = event.currentTarget.getBoundingClientRect();
//     const dropdownWidth = 120;
//     const viewportWidth = window.innerWidth;
//     const left = Math.min(rect.right - dropdownWidth, viewportWidth - dropdownWidth - 10);
//     setDropdownPosition({ top: rect.bottom + window.scrollY, left });
//     setOpenDropdownId(openDropdownId === id ? null : id);
//   };

//   const handleClickOutside = useCallback((event) => {
//     if (openDropdownId === null) return;
//     const triggerEl = dropdownTriggerRefs.current[openDropdownId];
//     const menuEl = dropdownMenuRef.current;
//     if (triggerEl && menuEl && !triggerEl.contains(event.target) && !menuEl.contains(event.target)) {
//       setOpenDropdownId(null);
//     }
//   }, [openDropdownId]);

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpenDropdownId(null); });
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", (e) => { if (e.key === "Escape") setOpenDropdownId(null); });
//     };
//   }, [handleClickOutside]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this schedule?")) return;
//     try {
//       const response = await fetch(`${API_BASE}/schedule/delete/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${auth?.token}` },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to delete schedule");
//       toast.success("Schedule deleted successfully");
//       fetchSchedules();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setOpenDropdownId(null);
//     }
//   };

//   const handleUpdate = (schedule) => {
//     setSelectedSchedule(schedule);
//     setShowForm(true);
//     setOpenDropdownId(null);
//   };

//   const handleView = (schedule) => {
//     setSelectedSchedule(schedule);
//     setOpenDropdownId(null);
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
//       <ScheduleDetailsModal schedule={selectedSchedule} onClose={() => setSelectedSchedule(null)} />

//       {!showForm ? (
//         <>
//           <div className={styles.headerRow}>
//             <h2 className={styles.title}>Schedules</h2>
//             <button className={styles.addButton} onClick={() => setShowForm(true)}>+ Add Schedule</button>
//           </div>

//           <div className={styles.searchForm}>
//             <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSearch()} />
//             <select value={selectedScheduleType} onChange={(e) => setSelectedScheduleType(e.target.value)}>
//               <option value="">All Schedule Types</option>
//               {scheduleTypes.map((type) => <option key={type} value={type}>{type}</option>)}
//             </select>
//             <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)}>
//               <option value="">All Routes</option>
//               {routes.map((route) => <option key={route} value={route}>{route}</option>)}
//             </select>
//             <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
//             <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} />
//             <button onClick={handleSearch}>Filter</button>
//           </div>

//           {loading ? (
//             <div className={styles.loader}><div className={styles.spinner}></div></div>
//           ) : schedules.length === 0 ? (
//             <p>No schedules found</p>
//           ) : (
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Route</th>
//                   <th>Train Name</th>
//                   <th>Schedule Type</th>
//                   <th>Departure</th>
//                   <th>Arrival</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {schedules.map((sched) => (
//                   <tr key={sched.id}>
//                     <td>{sched.route}</td>
//                     <td>{sched.trainName}</td>
//                     <td>{sched.scheduleType}</td>
//                     <td>{sched.departureDate} {sched.departureTime}</td>
//                     <td>{sched.arrivalDate} {sched.arrivalTime}</td>
//                     <td className={styles.actionCell}>
//                       <span ref={(el) => (dropdownTriggerRefs.current[sched.id] = el)} className={styles.actionIcon} onClick={(e) => handleDropdownOpen(sched.id, e)}>⋮</span>
//                       {openDropdownId === sched.id &&
//                         createPortal(
//                           <ul ref={dropdownMenuRef} className={styles.actionDropdown} style={{ top: dropdownPosition.top, left: dropdownPosition.left }}>
//                             <li onClick={() => handleView(sched)}>View</li>
//                             <li onClick={() => handleUpdate(sched)}>Update</li>
//                             <li onClick={() => handleDelete(sched.id)}>Delete</li>
//                           </ul>,
//                           document.body
//                         )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//           <div className={styles.pagination}>{renderPageButtons}</div>
//         </>
//       ) : (
//         <ScheduleForm schedule={selectedSchedule} onClose={() => { setShowForm(false); setSelectedSchedule(null); fetchSchedules(); }} />
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/ScheduleList.module.css";
import ScheduleForm from "./ScheduleForm";
import ScheduleDetailsModal from "./ScheduleDetailsModal";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function ScheduleList() {
  const { auth, logout } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduleTypes, setScheduleTypes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedScheduleType, setSelectedScheduleType] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownTriggerRefs = useRef({});
  const dropdownMenuRef = useRef(null);

  // ✅ Fetch schedules
  const fetchSchedules = useCallback(async () => {
    if (!auth?.token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("query", searchQuery);
      if (selectedScheduleType) params.append("scheduleType", selectedScheduleType);
      if (selectedRoute) params.append("route", selectedRoute);
      if (departureDate) params.append("departureDate", departureDate);
      if (arrivalDate) params.append("arrivalDate", arrivalDate);
      params.append("page", page);
      params.append("size", size);
      params.append("sortBy", "departureDate");
      params.append("sortDir", "desc");

      const url = `${API_BASE}/schedule/schedules/search?${params.toString()}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.status?.description || "Failed to fetch schedules");
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
  }, [auth, page, size, searchQuery, selectedScheduleType, selectedRoute, departureDate, arrivalDate, logout]);

  // ✅ Fetch filters
  useEffect(() => {
    if (!auth?.token) return;
    const fetchFilters = async () => {
      try {
        const [typesRes, routesRes] = await Promise.all([
          fetch(`${API_BASE}/schedule/get-all-scheduleType`, {
            headers: { Authorization: `Bearer ${auth?.token}` },
          }),
          fetch(`${API_BASE}/schedule/get-all-route`, {
            headers: { Authorization: `Bearer ${auth?.token}` },
          }),
        ]);

        const typesData = await typesRes.json();
        const routesData = await routesRes.json();

        if (!typesRes.ok) throw new Error(typesData.message || "Failed to fetch schedule types");
        if (!routesRes.ok) throw new Error(routesData.message || "Failed to fetch routes");

        setScheduleTypes(typesData || []);
        setRoutes(routesData || []);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchFilters();
  }, [auth]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleSearch = () => {
    setPage(0);
    fetchSchedules();
  };

  // ✅ Dropdown logic
  const handleDropdownOpen = (id, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownWidth = 120;
    const viewportWidth = window.innerWidth;
    const left = Math.min(rect.right - dropdownWidth, viewportWidth - dropdownWidth - 10);
    setDropdownPosition({ top: rect.bottom + window.scrollY, left });
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleClickOutside = useCallback(
    (event) => {
      if (openDropdownId === null) return;
      const triggerEl = dropdownTriggerRefs.current[openDropdownId];
      const menuEl = dropdownMenuRef.current;
      if (triggerEl && menuEl && !triggerEl.contains(event.target) && !menuEl.contains(event.target)) {
        setOpenDropdownId(null);
      }
    },
    [openDropdownId]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpenDropdownId(null);
    });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") setOpenDropdownId(null);
      });
    };
  }, [handleClickOutside]);

  // ✅ Delete schedule
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      const response = await fetch(`${API_BASE}/schedule/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete schedule");
      toast.success(data.message || "Schedule deleted successfully");
      fetchSchedules();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOpenDropdownId(null);
    }
  };

  const handleUpdate = (schedule) => {
    setSelectedSchedule(schedule);
    setShowForm(true);
    setOpenDropdownId(null);
  };

  const handleView = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenDropdownId(null);
  };

  // ✅ Pagination
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
      <ScheduleDetailsModal schedule={selectedSchedule} onClose={() => setSelectedSchedule(null)} />

      {!showForm ? (
        <>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Schedules</h2>
            <button className={styles.addButton} onClick={() => setShowForm(true)}>
              + Add Schedule
            </button>
          </div>

          <div className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <select value={selectedScheduleType} onChange={(e) => setSelectedScheduleType(e.target.value)}>
              <option value="">All Schedule Types</option>
              {scheduleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)}>
              <option value="">All Routes</option>
              {routes.map((route) => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))}
            </select>
            <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
            <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} />
            <button onClick={handleSearch}>Filter</button>
          </div>

          {loading ? (
            <div className={styles.loader}>
              <div className={styles.spinner}></div>
            </div>
          ) : schedules.length === 0 ? (
            <p>No schedules found</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Train Name</th>
                  <th>Schedule Type</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((sched) => (
                  <tr key={sched.id}>
                    <td>{sched.route}</td>
                    <td>{sched.trainName}</td>
                    <td>{sched.scheduleType}</td>
                    <td>
                      {sched.departureDate} {sched.departureTime}
                    </td>
                    <td>
                      {sched.arrivalDate} {sched.arrivalTime}
                    </td>
                    <td className={styles.actionCell}>
                      <span
                        ref={(el) => (dropdownTriggerRefs.current[sched.id] = el)}
                        className={styles.actionIcon}
                        onClick={(e) => handleDropdownOpen(sched.id, e)}
                      >
                        ⋮
                      </span>
                      {openDropdownId === sched.id &&
                        createPortal(
                          <ul
                            ref={dropdownMenuRef}
                            className={styles.actionDropdown}
                            style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                          >
                            <li onClick={() => handleView(sched)}>View</li>
                            <li onClick={() => handleUpdate(sched)}>Update</li>
                            <li onClick={() => handleDelete(sched.id)}>Delete</li>
                          </ul>,
                          document.body
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className={styles.pagination}>{renderPageButtons}</div>
        </>
      ) : (
        <ScheduleForm
          schedule={selectedSchedule}
          onClose={() => {
            setShowForm(false);
            setSelectedSchedule(null);
            fetchSchedules();
          }}
        />
      )}
    </div>
  );
}
