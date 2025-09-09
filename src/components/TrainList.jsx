// import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// import { createPortal } from "react-dom";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import styles from "../styles/TrainList.module.css";
// import "react-toastify/dist/ReactToastify.css";
// import TrainForm from "./TrainForm";
// import TrainUpdateForm from "./TrainUpdateForm";
// import TrainDetailsModal from "./TrainDetailsModal";

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// export default function TrainList() {
//   const { auth, logout } = useAuth();

//   const [trains, setTrains] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [openDropdownId, setOpenDropdownId] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//   const [openClassesId, setOpenClassesId] = useState(null);
//   const [classesDropdownPosition, setClassesDropdownPosition] = useState({ top: 0, left: 0 });
//   const [page, setPage] = useState(0);
//   const [size] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [updateTrain, setUpdateTrain] = useState(null);
//   const [selectedTrain, setSelectedTrain] = useState(null);
//   const [loadingTrain, setLoadingTrain] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const actionTriggerRefs = useRef({});
//   const classesTriggerRefs = useRef({});
//   const actionMenuRef = useRef(null);
//   const classesMenuRef = useRef(null);

//   // --- Utility to handle backend errors ---
//   const handleBackendError = useCallback(
//     (res, data) => {
//       const errorMessage =
//         data?.message || data?.status?.description || data?.error || "Unexpected error";

//       toast.error(errorMessage);

//       if (res.status === 401) {
//         logout();
//         window.location.href = "/login";
//       }
//       return errorMessage;
//     },
//     [logout]
//   );

//   // --- Fetch all trains ---
//   const fetchTrain = useCallback(async () => {
//     setLoading(true);
//     try {
//       const url = searchQuery.trim()
//         ? `${API_BASE}/train/searchTrain?query=${encodeURIComponent(searchQuery)}&page=${page}&size=${size}`
//         : `${API_BASE}/train/get-all-train?page=${page}&size=${size}`;

//       const res = await fetch(url, {
//         headers: { Authorization: `Bearer ${auth?.token}` },
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         handleBackendError(res, data);
//         return;
//       }
//           const sortedTrains = Array.isArray(data.content)
//       ? [...data.content].sort((a, b) => {
//           // If createdAt exists, sort by date
//           if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
//           // fallback: sort by id descending
//           return b.id - a.id;
//         })
//       : [];

//       setTrains(sortedTrains);
//       setTotalPages(data.totalPages ?? 0);
//     } catch (err) {
//       console.error("Network error:", err);
//       toast.error("Network error, please try again");
//     } finally {
//       setLoading(false);
//     }
//   }, [auth, page, size, searchQuery, handleBackendError]);

//   // --- Fetch single train by ID ---
//   const fetchTrainById = useCallback(
//     async (id) => {
//       setLoadingTrain(true);
//       try {
//         const res = await fetch(`${API_BASE}/train/get-train/${id}`, {
//           headers: { Authorization: `Bearer ${auth?.token}` },
//         });
//         const data = await res.json();
//         if (!res.ok) {
//           handleBackendError(res, data);
//           return;
//         }
//         setSelectedTrain(data);
//       } catch (err) {
//         console.error("Network error:", err);
//         toast.error("Network error, please try again");
//         setSelectedTrain(null);
//       } finally {
//         setLoadingTrain(false);
//       }
//     },
//     [auth, handleBackendError]
//   );

//   // --- Delete train ---
//   const handleDelete = useCallback(
//     async (id) => {
//       if (!window.confirm("Are you sure you want to delete this train?")) return;
//       try {
//         const res = await fetch(`${API_BASE}/train/delete-train/${id}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${auth?.token}` },
//         });
//         const data = await res.json();
//         if (!res.ok) {
//           handleBackendError(res, data);
//           return;
//         }
//         toast.success(typeof data === "string" ? data : "Train deleted");
//         fetchTrain();
//       } catch (err) {
//         console.error("Network error:", err);
//         toast.error("Network error, please try again");
//       } finally {
//         setOpenDropdownId(null);
//       }
//     },
//     [auth, fetchTrain, handleBackendError]
//   );

//   // --- Update train ---
//   const handleUpdate = useCallback((train) => {
//     setUpdateTrain(train);
//     setOpenDropdownId(null);
//   }, []);

//   // --- View train details ---
//   const handleView = useCallback(
//     (train) => {
//       fetchTrainById(train.id);
//       setOpenDropdownId(null);
//       setOpenClassesId(null);
//     },
//     [fetchTrainById]
//   );

//   // --- Dropdown handlers ---
//   const handleActionDropdownOpen = useCallback(
//     (id, e) => {
//       const rect = e.currentTarget.getBoundingClientRect();
//       const left = Math.min(rect.right - 160, window.innerWidth - 160 - 10);
//       setDropdownPosition({ top: rect.bottom + window.scrollY, left });
//       setOpenDropdownId(openDropdownId === id ? null : id);
//       setOpenClassesId(null);
//     },
//     [openDropdownId]
//   );

//   const handleClassesDropdownOpen = useCallback(
//     (id, e) => {
//       const rect = e.currentTarget.getBoundingClientRect();
//       const left = Math.min(rect.right - 200, window.innerWidth - 200 - 10);
//       setClassesDropdownPosition({ top: rect.bottom + window.scrollY, left });
//       setOpenClassesId(openClassesId === id ? null : id);
//       setOpenDropdownId(null);
//     },
//     [openClassesId]
//   );

//   // --- Close dropdowns on outside click ---
//   const handleClickOutside = useCallback(
//     (event) => {
//       const actionEl = actionTriggerRefs.current[openDropdownId];
//       const classesEl = classesTriggerRefs.current[openClassesId];
//       const actionMenuEl = actionMenuRef.current;
//       const classesMenuEl = classesMenuRef.current;

//       if (
//         openDropdownId &&
//         actionEl &&
//         actionMenuEl &&
//         !actionEl.contains(event.target) &&
//         !actionMenuEl.contains(event.target)
//       ) {
//         setOpenDropdownId(null);
//       }

//       if (
//         openClassesId &&
//         classesEl &&
//         classesMenuEl &&
//         !classesEl.contains(event.target) &&
//         !classesMenuEl.contains(event.target)
//       ) {
//         setOpenClassesId(null);
//       }
//     },
//     [openDropdownId, openClassesId]
//   );

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     const onKey = (e) => {
//       if (e.key === "Escape") {
//         setOpenDropdownId(null);
//         setOpenClassesId(null);
//         setSelectedTrain(null);
//       }
//     };
//     document.addEventListener("keydown", onKey);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", onKey);
//     };
//   }, [handleClickOutside]);

//   useEffect(() => {
//     if (auth?.token && !showCreateForm && !updateTrain) fetchTrain();
//   }, [auth, page, showCreateForm, updateTrain, fetchTrain]);

//   const handleSearch = useCallback(() => {
//     setPage(0);
//     fetchTrain();
//   }, [fetchTrain]);

//   const roles = auth?.roles || [];

//   const renderPageButtons = useMemo(() => {
//     if (totalPages === 0 || showCreateForm || updateTrain) return [];
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
//   }, [page, totalPages, showCreateForm, updateTrain]);

//   if (!roles.includes("SUPERADMIN_ROLE")) {
//     return (
//       <div className={styles.notAuthorized}>
//         <h2>🚫 Not Authorized</h2>
//         <p>You don’t have permission to view train management.</p>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <TrainDetailsModal train={selectedTrain} loading={loadingTrain} onClose={() => setSelectedTrain(null)} />

//       {/* Show Create or Update forms */}
//       {showCreateForm ? (
//         <TrainForm
//           onSuccess={() => {
//             setShowCreateForm(false);
//             fetchTrain();
//           }}
//         />
//       ) : updateTrain ? (
//         <TrainUpdateForm
//           train={updateTrain}
//           onSuccess={() => {
//             setUpdateTrain(null);
//             fetchTrain();
//           }}
//             onBack={() => setUpdateTrain(null)}
//         />
//       ) : (
//         <>
//           <div className={styles.headerRow}>
//             <h2 className={styles.title}>Train</h2>
//             <button className={styles.addButton} onClick={() => setShowCreateForm(true)}>+ Add Train</button>
//           </div>

//           <div className={styles.searchForm}>
//             <input
//               type="text"
//               placeholder="Search by Train Name or Code"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             />
//             <button onClick={handleSearch}>Search</button>
//           </div>

//           {loading ? (
//             <div className={styles.loader}>
//               <div className={styles.spinner}></div>
//             </div>
//           ) : trains.length === 0 ? (
//             <p className={styles.empty}>No Train found</p>
//           ) : (
//             <>
//               <table className={styles.table}>
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Train Name</th>
//                     <th>Train Code</th>
//                     <th>Classes</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {trains.map((train, idx) => (
//                     <tr key={train.id}>
//                       <td>{page * size + idx + 1}</td>
//                       <td>{train.trainName}</td>
//                       <td>{train.trainCode}</td>
//                       <td>
//                         <button
//                           className={styles.actionIcon}
//                           ref={(el) => (classesTriggerRefs.current[train.id] = el)}
//                           aria-label="View classes"
//                           aria-expanded={openClassesId === train.id}
//                           onClick={(e) => handleClassesDropdownOpen(train.id, e)}
//                           title="View classes"
//                         >
//                           ⋮
//                         </button>
//                       </td>
//                       <td>
//                         <button
//                           className={styles.actionIcon}
//                           ref={(el) => (actionTriggerRefs.current[train.id] = el)}
//                           aria-label="Train actions"
//                           aria-expanded={openDropdownId === train.id}
//                           onClick={(e) => handleActionDropdownOpen(train.id, e)}
//                           title="Actions"
//                         >
//                           ⋮
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* Actions dropdown */}
//               {openDropdownId &&
//                 (() => {
//                   const train = trains.find((t) => t.id === openDropdownId);
//                   return createPortal(
//                     <div
//                       className={styles.actionDropdown}
//                       ref={actionMenuRef}
//                       style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
//                     >
//                       <button onClick={() => handleUpdate(train)}>Update</button>
//                       <button onClick={() => handleView(train)}>View</button>
//                       <button className={styles.deleteAction} onClick={() => handleDelete(train.id)}>
//                         Delete
//                       </button>
//                     </div>,
//                     document.body
//                   );
//                 })()}

//               {/* Classes dropdown */}
//               {openClassesId &&
//                 (() => {
//                   const train = trains.find((t) => t.id === openClassesId);
//                   const list = Array.isArray(train?.trainClasses) ? train.trainClasses : [];
//                   return createPortal(
//                     <div
//                       className={styles.actionDropdown}
//                       ref={classesMenuRef}
//                       style={{ top: classesDropdownPosition.top, left: classesDropdownPosition.left, minWidth: 200 }}
//                     >
//                       {list.length > 0
//                         ? list.map((cls, i) => (
//                             <button key={i} className={styles.classItem} disabled>
//                               {cls}
//                             </button>
//                           ))
//                         : <button className={styles.classItem} disabled>No classes</button>}
//                     </div>,
//                     document.body
//                   );
//                 })()}

//               <div className={styles.pagination}>
//                 <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
//                 {renderPageButtons}
//                 <button disabled={page === totalPages - 1 || totalPages === 0} onClick={() => setPage(page + 1)}>Next</button>
//               </div>
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/TrainList.module.css";
import "react-toastify/dist/ReactToastify.css";
import TrainForm from "./TrainForm";
import TrainUpdateForm from "./TrainUpdateForm";
import TrainDetailsModal from "./TrainDetailsModal";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function TrainList() {
  const { auth, logout } = useAuth();

  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [openClassesId, setOpenClassesId] = useState(null);
  const [classesDropdownPosition, setClassesDropdownPosition] = useState({ top: 0, left: 0 });
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [updateTrain, setUpdateTrain] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [loadingTrain, setLoadingTrain] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedTrainId, setHighlightedTrainId] = useState(null); // <-- NEW

  const actionTriggerRefs = useRef({});
  const classesTriggerRefs = useRef({});
  const actionMenuRef = useRef(null);
  const classesMenuRef = useRef(null);

  // --- Handle backend errors ---
  const handleBackendError = useCallback(
    (res, data) => {
      const errorMessage =
        data?.message || data?.status?.description || data?.error || "Unexpected error";

      toast.error(errorMessage);

      if (res.status === 401) {
        logout();
        window.location.href = "/login";
      }
      return errorMessage;
    },
    [logout]
  );

  // --- Fetch all trains ---
  const fetchTrain = useCallback(async () => {
    setLoading(true);
    try {
      const url = searchQuery.trim()
        ? `${API_BASE}/train/searchTrain?query=${encodeURIComponent(searchQuery)}&page=${page}&size=${size}`
        : `${API_BASE}/train/get-all-train?page=${page}&size=${size}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        handleBackendError(res, data);
        return;
      }

      const sortedTrains = Array.isArray(data.content)
        ? [...data.content].sort((a, b) => {
            if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
            return b.id - a.id;
          })
        : [];

      setTrains(sortedTrains);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Network error, please try again");
    } finally {
      setLoading(false);
    }
  }, [auth, page, size, searchQuery, handleBackendError]);

  // --- Fetch single train ---
  const fetchTrainById = useCallback(
    async (id) => {
      setLoadingTrain(true);
      try {
        const res = await fetch(`${API_BASE}/train/get-train/${id}`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          handleBackendError(res, data);
          return;
        }
        setSelectedTrain(data);
      } catch (err) {
        console.error("Network error:", err);
        toast.error("Network error, please try again");
        setSelectedTrain(null);
      } finally {
        setLoadingTrain(false);
      }
    },
    [auth, handleBackendError]
  );

  // --- Delete train ---
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this train?")) return;
      try {
        const res = await fetch(`${API_BASE}/train/delete-train/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          handleBackendError(res, data);
          return;
        }
        toast.success(typeof data === "string" ? data : "Train deleted");
        fetchTrain();
      } catch (err) {
        console.error("Network error:", err);
        toast.error("Network error, please try again");
      } finally {
        setOpenDropdownId(null);
      }
    },
    [auth, fetchTrain, handleBackendError]
  );

  // --- Update train ---
  const handleUpdate = useCallback((train) => {
    setUpdateTrain(train);
    setOpenDropdownId(null);
  }, []);

  // --- View train details ---
  const handleView = useCallback(
    (train) => {
      fetchTrainById(train.id);
      setOpenDropdownId(null);
      setOpenClassesId(null);
    },
    [fetchTrainById]
  );

  // --- Dropdown handlers ---
  const handleActionDropdownOpen = useCallback(
    (id, e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const left = Math.min(rect.right - 160, window.innerWidth - 160 - 10);
      setDropdownPosition({ top: rect.bottom + window.scrollY, left });
      setOpenDropdownId(openDropdownId === id ? null : id);
      setOpenClassesId(null);
    },
    [openDropdownId]
  );

  const handleClassesDropdownOpen = useCallback(
    (id, e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const left = Math.min(rect.right - 200, window.innerWidth - 200 - 10);
      setClassesDropdownPosition({ top: rect.bottom + window.scrollY, left });
      setOpenClassesId(openClassesId === id ? null : id);
      setOpenDropdownId(null);
    },
    [openClassesId]
  );

  // --- Close dropdowns on outside click ---
  const handleClickOutside = useCallback(
    (event) => {
      const actionEl = actionTriggerRefs.current[openDropdownId];
      const classesEl = classesTriggerRefs.current[openClassesId];
      const actionMenuEl = actionMenuRef.current;
      const classesMenuEl = classesMenuRef.current;

      if (
        openDropdownId &&
        actionEl &&
        actionMenuEl &&
        !actionEl.contains(event.target) &&
        !actionMenuEl.contains(event.target)
      ) {
        setOpenDropdownId(null);
      }

      if (
        openClassesId &&
        classesEl &&
        classesMenuEl &&
        !classesEl.contains(event.target) &&
        !classesMenuEl.contains(event.target)
      ) {
        setOpenClassesId(null);
      }
    },
    [openDropdownId, openClassesId]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenDropdownId(null);
        setOpenClassesId(null);
        setSelectedTrain(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (auth?.token && !showCreateForm && !updateTrain) fetchTrain();
  }, [auth, page, showCreateForm, updateTrain, fetchTrain]);

  const handleSearch = useCallback(() => {
    setPage(0);
    fetchTrain();
  }, [fetchTrain]);

  const roles = auth?.roles || [];

  const renderPageButtons = useMemo(() => {
    if (totalPages === 0 || showCreateForm || updateTrain) return [];
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
  }, [page, totalPages, showCreateForm, updateTrain]);

  if (!roles.includes("SUPERADMIN_ROLE")) {
    return (
      <div className={styles.notAuthorized}>
        <h2>🚫 Not Authorized</h2>
        <p>You don’t have permission to view train management.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TrainDetailsModal train={selectedTrain} loading={loadingTrain} onClose={() => setSelectedTrain(null)} />

      {/* Show Create or Update forms */}
      {showCreateForm ? (
        <TrainForm
          onSuccess={(newTrain) => {
            setShowCreateForm(false);
            setHighlightedTrainId(newTrain.id); // highlight new train
            setPage(0); // first page
            fetchTrain();
          }}
        />
      ) : updateTrain ? (
        <TrainUpdateForm
          train={updateTrain}
          onSuccess={() => {
            setUpdateTrain(null);
            setPage(0);
            fetchTrain();
          }}
          onBack={() => setUpdateTrain(null)}
        />
      ) : (
        <>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Train</h2>
            <button className={styles.addButton} onClick={() => setShowCreateForm(true)}>
              + Add Train
            </button>
          </div>

          <div className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search by Train Name or Code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {loading ? (
            <div className={styles.loader}>
              <div className={styles.spinner}></div>
            </div>
          ) : trains.length === 0 ? (
            <p className={styles.empty}>No Train found</p>
          ) : (
            <>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Train Name</th>
                    <th>Train Code</th>
                    <th>Classes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trains.map((train, idx) => (
                    <tr
                      key={train.id}
                      className={train.id === highlightedTrainId ? styles.highlightRow : ""}
                    >
                      <td>{page * size + idx + 1}</td>
                      <td>{train.trainName}</td>
                      <td>{train.trainCode}</td>
                      <td>
                        <button
                          className={styles.actionIcon}
                          ref={(el) => (classesTriggerRefs.current[train.id] = el)}
                          aria-label="View classes"
                          aria-expanded={openClassesId === train.id}
                          onClick={(e) => handleClassesDropdownOpen(train.id, e)}
                          title="View classes"
                        >
                          ⋮
                        </button>
                      </td>
                      <td>
                        <button
                          className={styles.actionIcon}
                          ref={(el) => (actionTriggerRefs.current[train.id] = el)}
                          aria-label="Train actions"
                          aria-expanded={openDropdownId === train.id}
                          onClick={(e) => handleActionDropdownOpen(train.id, e)}
                          title="Actions"
                        >
                          ⋮
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Actions dropdown */}
              {openDropdownId &&
                (() => {
                  const train = trains.find((t) => t.id === openDropdownId);
                  return createPortal(
                    <div
                      className={styles.actionDropdown}
                      ref={actionMenuRef}
                      style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                    >
                      <button onClick={() => handleUpdate(train)}>Update</button>
                      <button onClick={() => handleView(train)}>View</button>
                      <button className={styles.deleteAction} onClick={() => handleDelete(train.id)}>
                        Delete
                      </button>
                    </div>,
                    document.body
                  );
                })()}

              {/* Classes dropdown */}
              {openClassesId &&
                (() => {
                  const train = trains.find((t) => t.id === openClassesId);
                  const list = Array.isArray(train?.trainClasses) ? train.trainClasses : [];
                  return createPortal(
                    <div
                      className={styles.actionDropdown}
                      ref={classesMenuRef}
                      style={{ top: classesDropdownPosition.top, left: classesDropdownPosition.left, minWidth: 200 }}
                    >
                      {list.length > 0
                        ? list.map((cls, i) => (
                            <button key={i} className={styles.classItem} disabled>
                              {cls}
                            </button>
                          ))
                        : <button className={styles.classItem} disabled>No classes</button>}
                    </div>,
                    document.body
                  );
                })()}

              <div className={styles.pagination}>
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                {renderPageButtons}
                <button disabled={page === totalPages - 1 || totalPages === 0} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
