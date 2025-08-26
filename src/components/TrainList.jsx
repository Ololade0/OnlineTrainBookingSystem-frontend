
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/TrainList.module.css";
import "react-toastify/dist/ReactToastify.css";
import TrainForm from "./TrainForm";
import TrainDetailsModal from "./TrainDetailsModal";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function TrainList() {
  const { auth } = useAuth();

  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);

  // Actions dropdown state
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Classes dropdown state
  const [openClassesId, setOpenClassesId] = useState(null);
  const [classesDropdownPosition, setClassesDropdownPosition] = useState({ top: 0, left: 0 });

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [loadingTrain, setLoadingTrain] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // separate refs for action & classes triggers + menus
  const actionTriggerRefs = useRef({});
  const classesTriggerRefs = useRef({});
  const actionMenuRef = useRef(null);
  const classesMenuRef = useRef(null);

  // ✅ Fetch trains (switch between search + all)
  const fetchTrain = useCallback(async () => {
    setLoading(true);
    try {
      let url = "";
      if (searchQuery.trim()) {
        url = `${API_BASE}/train/searchTrain?query=${encodeURIComponent(searchQuery)}&page=${page}&size=${size}`;
      } else {
        url = `${API_BASE}/train/get-all-train?page=${page}&size=${size}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.status?.description || "Failed to fetch trains");

      // IMPORTANT: your backend returns { content: [...] } with each item having "id"
      setTrains(Array.isArray(data.content) ? data.content : []);
      setTotalPages(data.totalPages ?? 0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [auth, page, size, searchQuery]);

  // ✅ Fetch single train by ID
  const fetchTrainById = useCallback(
    async (id) => {
      setLoadingTrain(true);
      try {
        const response = await fetch(`${API_BASE}/train/get-train/${id}`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch train");
        setSelectedTrain(data);
      } catch (error) {
        toast.error(error.message);
        setSelectedTrain(null);
      } finally {
        // fix: stop the spinner (it previously set selectedTrain to false)
        setLoadingTrain(false);
      }
    },
    [auth]
  );

  // ✅ Delete train
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this train?")) return;
      try {
        const response = await fetch(`${API_BASE}/train/delete-train/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to delete train");
        toast.success(typeof data === "string" ? data : "Train deleted");
        fetchTrain();
      } catch (error) {
        toast.error(error.message);
      } finally {
        setOpenDropdownId(null);
      }
    },
    [auth, fetchTrain]
  );

  const handleUpdate = useCallback((train) => {
    setSelectedTrain(train);
    setShowForm(true);
    setOpenDropdownId(null);
    setOpenClassesId(null);
  }, []);

  const handleView = useCallback(
    (train) => {
      fetchTrainById(train.id); // backend uses "id"
      setOpenDropdownId(null);
      setOpenClassesId(null);
    },
    [fetchTrainById]
  );

  // Open the Actions dropdown
  const handleActionDropdownOpen = useCallback(
    (id, event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const dropdownWidth = 160;
      const viewportWidth = window.innerWidth;
      const left = Math.min(rect.right - dropdownWidth, viewportWidth - dropdownWidth - 10);
      setDropdownPosition({ top: rect.bottom + window.scrollY, left });
      setOpenDropdownId(openDropdownId === id ? null : id);
      // close classes if open
      setOpenClassesId(null);
    },
    [openDropdownId]
  );

  // Open the Classes dropdown
  const handleClassesDropdownOpen = useCallback(
    (id, event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const dropdownWidth = 200;
      const viewportWidth = window.innerWidth;
      const left = Math.min(rect.right - dropdownWidth, viewportWidth - dropdownWidth - 10);
      setClassesDropdownPosition({ top: rect.bottom + window.scrollY, left });
      setOpenClassesId(openClassesId === id ? null : id);
      // close actions if open
      setOpenDropdownId(null);
    },
    [openClassesId]
  );

  // Close dropdowns on outside click / Esc
  const handleClickOutside = useCallback(
    (event) => {
      const actionTriggerEl = actionTriggerRefs.current[openDropdownId];
      const classesTriggerEl = classesTriggerRefs.current[openClassesId];
      const actionMenuEl = actionMenuRef.current;
      const classesMenuEl = classesMenuRef.current;

      // If click is outside both trigger and menu for actions
      const clickOutsideActions =
        openDropdownId !== null &&
        actionTriggerEl &&
        actionMenuEl &&
        !actionTriggerEl.contains(event.target) &&
        !actionMenuEl.contains(event.target);

      // If click is outside both trigger and menu for classes
      const clickOutsideClasses =
        openClassesId !== null &&
        classesTriggerEl &&
        classesMenuEl &&
        !classesTriggerEl.contains(event.target) &&
        !classesMenuEl.contains(event.target);

      if (clickOutsideActions) setOpenDropdownId(null);
      if (clickOutsideClasses) setOpenClassesId(null);
    },
    [openDropdownId, openClassesId]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenDropdownId(null);
        setOpenClassesId(null);
        setSelectedTrain(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (auth?.token && !showForm) fetchTrain();
  }, [auth, page, showForm, fetchTrain]);

  const handleSearch = useCallback(() => {
    setPage(0);
    fetchTrain();
  }, [fetchTrain]);

  const roles = auth?.roles || [];

  const renderPageButtons = useMemo(() => {
    if (totalPages === 0 || showForm) return null;
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
  }, [page, totalPages, showForm]);

  if (!roles.includes("SUPERADMIN_ROLE")) {
    return (
      <div className={styles.notAuthorized}>
        <h2>🚫 Not Authorized</h2>
        <p>You don’t have permission to view station management.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TrainDetailsModal
        train={selectedTrain}
        loading={loadingTrain}
        onClose={() => setSelectedTrain(null)}
      />

      {!showForm ? (
        <>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Train</h2>
            <button className={styles.addButton} onClick={() => setShowForm(true)}>
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
                  {trains.map((train, index) => (
                    <tr key={train.id}>
                      <td>{page * size + index + 1}</td>
                      <td>{train.trainName}</td>
                      <td>{train.trainCode}</td>

                      {/* Classes column with 3 dots */}
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

                      {/* Actions column with 3 dots */}
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

              {/* Actions dropdown (Update / View / Delete) */}
              {openDropdownId &&
                (() => {
                  const train = trains.find((s) => s.id === openDropdownId);
                  return createPortal(
                    <div
                      className={styles.actionDropdown}
                      ref={actionMenuRef}
                      style={{
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                      }}
                    >
                      <button onClick={() => handleUpdate(train)}>Update</button>
                      <button onClick={() => handleView(train)}>View</button>
                      <button
                        className={styles.deleteAction}
                        onClick={() => handleDelete(train.id)}
                      >
                        Delete
                      </button>
                    </div>,
                    document.body
                  );
                })()}

              {/* Classes dropdown (read-only list) */}
              {openClassesId &&
                (() => {
                  const train = trains.find((s) => s.id === openClassesId);
                  const list = Array.isArray(train?.trainClasses) ? train.trainClasses : [];
                  return createPortal(
                    <div
                      className={styles.actionDropdown}
                      ref={classesMenuRef}
                      style={{
                        top: classesDropdownPosition.top,
                        left: classesDropdownPosition.left,
                        minWidth: 200,
                      }}
                    >
                      {list.length > 0 ? (
                        list.map((cls, i) => (
                          <button key={i} className={styles.classItem} disabled>
                            {cls}
                          </button>
                        ))
                      ) : (
                        <button className={styles.classItem} disabled>
                          No classes
                        </button>
                      )}
                    </div>,
                    document.body
                  );
                })()}

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
        </>
      ) : (
        <TrainForm
          train={selectedTrain}
          onSuccess={() => {
            setShowForm(false);
            setSelectedTrain(null);
            fetchTrain();
          }}
        />
      )}
    </div>
  );
}
