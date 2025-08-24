// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import StationDetailsModal from "./StationDetailsModal";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/AuthContext";
// import { createPortal } from "react-dom";
// import styles from "../styles/StationList.module.css";

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// const StationList = () => {
//   const { auth } = useAuth();
//   const navigate = useNavigate();
//   const [stations, setStations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedStation, setSelectedStation] = useState(null); // For view
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [openDropdownId, setOpenDropdownId] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//   const dropdownTriggerRefs = useRef({});
//   const dropdownMenuRef = useRef(null);

//   const fetchStations = async () => {
//     setLoading(true);
//     try {
//       const url = `${API_BASE}/station/get-all-station?page=${page}&size=10`;
//       const res = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           ...(auth?.token && { Authorization: `Bearer ${auth.token}` }),
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.status?.description || "Failed to fetch stations");
//       setStations(data.content || []);
//       setTotalPages(data.totalPages || 1);
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStations();
//   }, [auth, page]);

//   const handleEdit = (station) => {
//     navigate(`/stations/edit/${station.stationId}`);
//     setOpenDropdownId(null);
//   };

//   const handleView = (station) => {
//     setSelectedStation(station);
//     setOpenDropdownId(null);
//   };

//   const handleDelete = async (stationId) => {
//     if (!window.confirm("Are you sure you want to delete this station?")) return;
//     try {
//       const res = await fetch(`${API_BASE}/station/delete-station/${stationId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${auth.token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.status?.description || "Failed to delete station");
//       toast.success("Station deleted successfully");
//       fetchStations();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setOpenDropdownId(null);
//     }
//   };

//   const handleDropdownOpen = (id, e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const dropdownWidth = 120;
//     const viewportWidth = window.innerWidth;
//     const left = Math.min(rect.right - dropdownWidth, viewportWidth - dropdownWidth - 10);
//     setDropdownPosition({ top: rect.bottom + window.scrollY, left });
//     setOpenDropdownId(openDropdownId === id ? null : id);
//   };

//   const handleClickOutside = (event) => {
//     if (!openDropdownId) return;
//     const triggerEl = dropdownTriggerRefs.current[openDropdownId];
//     const menuEl = dropdownMenuRef.current;
//     if (triggerEl && menuEl && !triggerEl.contains(event.target) && !menuEl.contains(event.target)) {
//       setOpenDropdownId(null);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [openDropdownId]);

//   return (
//     <div className={styles.container}>
//       <div className={styles.headerRow}>
//         <h2 className={styles.title}>Stations</h2>
//         <button
//           className={styles.addButton}
//           onClick={() => navigate("/stations/new")}
//         >
//           + Add Station
//         </button>
//       </div>

//       {loading ? (
//         <div className={styles.loader}>
//           <div className={styles.spinner}></div>
//         </div>
//       ) : stations.length === 0 ? (
//         <p className={styles.empty}>No stations available</p>
//       ) : (
//         <>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Code</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stations.map((station) => (
//                 <tr key={station.stationId}>
//                   <td>{station.stationName}</td>
//                   <td>{station.stationCode}</td>
//                   <td className={styles.actionWrapper}>
//                     <button
//                       ref={(el) => (dropdownTriggerRefs.current[station.stationId] = el)}
//                       className={styles.actionIcon}
//                       onClick={(e) => handleDropdownOpen(station.stationId, e)}
//                     >
//                       ⋮
//                     </button>
//                     {openDropdownId === station.stationId &&
//                       createPortal(
//                         <div
//                           ref={dropdownMenuRef}
//                           className={styles.actionDropdown}
//                           style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
//                         >
//                           <button onClick={() => handleEdit(station)}>Edit</button>
//                           <button onClick={() => handleView(station)}>View</button>
//                           <button
//                             className={styles.deleteAction}
//                             onClick={() => handleDelete(station.stationId)}
//                           >
//                             Delete
//                           </button>
//                         </div>,
//                         document.body
//                       )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className={styles.pagination}>
//             <button disabled={page === 0} onClick={() => setPage(page - 1)}>
//               Previous
//             </button>
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 className={page === i ? styles.activePage : ""}
//                 onClick={() => setPage(i)}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               disabled={page + 1 === totalPages}
//               onClick={() => setPage(page + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}

//       {selectedStation && (
//         <StationDetailsModal
//           station={selectedStation}
//           onClose={() => setSelectedStation(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default StationList;


import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StationDetailsModal from "./StationDetailsModal";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { createPortal } from "react-dom";
import styles from "../styles/StationList.module.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const StationList = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownTriggerRefs = useRef({});
  const dropdownMenuRef = useRef(null);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/station/get-all-station?page=${page}&size=10`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(auth?.token && { Authorization: `Bearer ${auth.token}` }),
        },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.status?.description || "Failed to fetch stations");
      setStations(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, [auth, page]);

  const handleEdit = (station) => {
    navigate(`/stations/edit/${station.stationId}`);
    setOpenDropdownId(null);
  };

  const handleView = (station) => {
    setSelectedStation(station);
    setOpenDropdownId(null);
  };

  const handleDelete = async (stationId) => {
    if (!window.confirm("Are you sure you want to delete this station?")) return;
    try {
      const res = await fetch(
        `${API_BASE}/station/delete-station/${stationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.status?.description || "Failed to delete station");
      toast.success("Station deleted successfully");
      fetchStations();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOpenDropdownId(null);
    }
  };

  const handleDropdownOpen = (id, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dropdownWidth = 120;
    const viewportWidth = window.innerWidth;
    const left = Math.min(
      rect.right - dropdownWidth,
      viewportWidth - dropdownWidth - 10
    );
    setDropdownPosition({ top: rect.bottom + window.scrollY, left });
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleClickOutside = (event) => {
    if (!openDropdownId) return;
    const triggerEl = dropdownTriggerRefs.current[openDropdownId];
    const menuEl = dropdownMenuRef.current;
    if (
      triggerEl &&
      menuEl &&
      !triggerEl.contains(event.target) &&
      !menuEl.contains(event.target)
    ) {
      setOpenDropdownId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Stations</h2>
        <button
          className={styles.addButton}
          onClick={() => navigate("/stations/new")}
        >
          + Add Station
        </button>
      </div>

      {loading ? (
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
        </div>
      ) : stations.length === 0 ? (
        <p className={styles.empty}>No stations available</p>
      ) : (
        <>
          <table className={styles.table}>
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
                  <td className={styles.actionWrapper}>
                    <button
                      ref={(el) =>
                        (dropdownTriggerRefs.current[station.stationId] = el)
                      }
                      className={styles.actionIcon}
                      onClick={(e) => handleDropdownOpen(station.stationId, e)}
                    >
                      ⋮
                    </button>
                    {openDropdownId === station.stationId &&
                      createPortal(
                        <div
                          ref={dropdownMenuRef}
                          className={styles.actionDropdown}
                          style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                          }}
                        >
                          <button onClick={() => handleEdit(station)}>Edit</button>
                          <button onClick={() => handleView(station)}>View</button>
                          <button
                            className={styles.deleteAction}
                            onClick={() => handleDelete(station.stationId)}
                          >
                            Delete
                          </button>
                        </div>,
                        document.body
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={page === i ? styles.activePage : ""}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page + 1 === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedStation &&
        createPortal(
          <StationDetailsModal
            station={selectedStation}
            onClose={() => setSelectedStation(null)}
          />,
          document.body
        )}
    </div>
  );
};

export default StationList;
