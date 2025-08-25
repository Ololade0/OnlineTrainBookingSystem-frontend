import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/StationList.module.css"; // changed file name
import "react-toastify/dist/ReactToastify.css";
import StationForm from "./StationForm"; // changed
import StationDetailsModal from "./StationDetailsModal"; // changed

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function StationList() {
  const { auth } = useAuth();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loadingStation, setLoadingStation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownTriggerRefs = useRef({});
  const dropdownMenuRef = useRef(null);

  const fetchStations = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = `query=${encodeURIComponent(searchQuery)}&page=${page}&size=${size}`;
      const response = await fetch(`${API_BASE}/station/searchStations?${queryParams}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.status?.description || "Failed to fetch stations");

      setStations(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [auth, page, size, searchQuery]);

  const fetchStationById = useCallback(async (id) => {
    setLoadingStation(true);
    try {
      const response = await fetch(`${API_BASE}/station/get-station/${id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch station");
      setSelectedStation(data);
    } catch (error) {
      toast.error(error.message);
      setSelectedStation(null);
    } finally {
      setLoadingStation(false);
    }
  }, [auth]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this station?")) return;
    try {
      const response = await fetch(`${API_BASE}/station/delete-station/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete station");
      toast.success(data);
      fetchStations();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setOpenDropdownId(null);
    }
  }, [auth, fetchStations]);

  const handleUpdate = useCallback((station) => {
    setSelectedStation(station);
    setShowForm(true);
    setOpenDropdownId(null);
  }, []);

  const handleView = useCallback((station) => {
    fetchStationById(station.stationId);
    setOpenDropdownId(null);
  }, [fetchStationById]);

  const handleDropdownOpen = useCallback((id, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownWidth = 120;
    const viewportWidth = window.innerWidth;
    const left = Math.min(rect.right - dropdownWidth, viewportWidth - dropdownWidth - 10);
    setDropdownPosition({ top: rect.bottom + window.scrollY, left });
    setOpenDropdownId(openDropdownId === id ? null : id);
  }, [openDropdownId]);

  const handleClickOutside = useCallback((event) => {
    if (openDropdownId === null) return;
    const triggerEl = dropdownTriggerRefs.current[openDropdownId];
    const menuEl = dropdownMenuRef.current;
    if (triggerEl && menuEl && !triggerEl.contains(event.target) && !menuEl.contains(event.target)) {
      setOpenDropdownId(null);
    }
  }, [openDropdownId]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setOpenDropdownId(null);
        setSelectedStation(null);
      }
    });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setOpenDropdownId(null);
          setSelectedStation(null);
        }
      });
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (auth?.token && !showForm) fetchStations();
  }, [auth, page, showForm, fetchStations]);

  const handleSearch = useCallback(() => {
    setPage(0);
    fetchStations();
  }, [fetchStations]);

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
      <StationDetailsModal
        station={selectedStation}
        loading={loadingStation}
        onClose={() => setSelectedStation(null)}
      />

      {!showForm ? (
        <>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Stations</h2>
            <button className={styles.addButton} onClick={() => setShowForm(true)}>+ Add Station</button>
          </div>

          <div className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search by Station Name or Code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {loading ? (
            <div className={styles.loader}><div className={styles.spinner}></div></div>
          ) : stations.length === 0 ? (
            <p className={styles.empty}>No stations found</p>
          ) : (
            <>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Station Name</th>
                    <th>Station Code</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stations.map((station, index) => (
                    <tr key={station.stationId}>
                      <td>{page * size + index + 1}</td>
                      <td>{station.stationName}</td>
                      <td>{station.stationCode}</td>
                      <td>
                        <button
                          className={styles.actionIcon}
                          ref={(el) => (dropdownTriggerRefs.current[station.stationId] = el)}
                          aria-label="Station actions"
                          aria-expanded={openDropdownId === station.stationId}
                          onClick={(e) => handleDropdownOpen(station.stationId, e)}
                        >
                          ⋮
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {openDropdownId &&
                (() => {
                  const station = stations.find((s) => s.stationId === openDropdownId);
                  return createPortal(
                    <div
                      className={styles.actionDropdown}
                      ref={dropdownMenuRef}
                      style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                    >
                      <button onClick={() => handleUpdate(station)}>Update</button>
                      <button onClick={() => handleView(station)}>View</button>
                      <button className={styles.deleteAction} onClick={() => handleDelete(station.stationId)}>Delete</button>
                    </div>,
                    document.body
                  );
                })()
              }

              <div className={styles.pagination}>
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                {renderPageButtons}
                <button disabled={page === totalPages - 1 || totalPages === 0} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </>
          )}
        </>
      ) : (
        <StationForm
          station={selectedStation}
          onSuccess={() => {
            setShowForm(false);
            setSelectedStation(null);
            fetchStations();
          }}
        />
      )}
    </div>
  );
}
