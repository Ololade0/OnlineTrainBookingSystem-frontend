import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; 
import styles from "../styles/ScheduleList.module.css"; 
import ScheduleForm from "./ScheduleForm";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function ScheduleList() {
  const { auth } = useAuth(); 
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownPosition = useRef({ top: 0, left: 0 });

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/schedule/find-all-schedules?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch schedules");
      setSchedules(Array.isArray(data.content) ? data.content : []);
      setTotalPages(data.totalPages ?? 0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [auth, page, size]);

  useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.actionDropdown}`) && !e.target.closest(`.${styles.actionIcon}`)) {
        setOpenDropdownId(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAddSchedule = () => {
    setShowForm(true);
    setSelectedSchedule(null);
  };

  const handleUpdate = (schedule) => {
    setSelectedSchedule(schedule);
    setShowForm(true);
    setOpenDropdownId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      const response = await fetch(`${API_BASE}/schedule/delete-schedule/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete schedule");
      toast.success("Schedule deleted");
      fetchSchedules();
    } catch (error) {
      toast.error(error.message);
    } finally { setOpenDropdownId(null); }
  };

  const handleActionDropdownOpen = (id, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    dropdownPosition.current = { top: rect.bottom + window.scrollY, left: rect.right - 160 };
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredSchedules = useMemo(() => {
    let result = [...schedules];
    if (searchTerm) {
      result = result.filter(
        (s) =>
          s.trainName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.departureStationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.arrivalStationName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortField) {
      result.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [schedules, searchTerm, sortField, sortOrder]);

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
      {showForm ? (
        <ScheduleForm
          schedule={selectedSchedule}
          onSuccess={() => {
            setShowForm(false);
            fetchSchedules();
          }}
        />
      ) : (
        <>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Schedule</h2>
            <div className={styles.searchForm}>
              <input
                placeholder="Search by schedule"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className={styles.addButton} onClick={handleAddSchedule}>
                + Add Schedule
              </button>
            </div>
          </div>

          {loading ? (
            <div className={styles.loader}>Loading...</div>
          ) : filteredSchedules.length === 0 ? (
            <p className={styles.empty}>No schedules found</p>
          ) : (
            <>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th onClick={() => handleSort("departureDate")}>Departure Date</th>
                    <th onClick={() => handleSort("arrivalDate")}>Arrival Date</th>
                    <th onClick={() => handleSort("departureTime")}>Departure Time</th>
                    <th onClick={() => handleSort("arrivalTime")}>Arrival Time</th>
                    <th>Duration</th>
                    <th>Distance</th>
                    <th onClick={() => handleSort("trainName")}>Train Name</th>
                    <th>Departure Station</th>
                    <th>Arrival Station</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule, index) => (
                    <tr key={schedule.id}>
                      <td>{page * size + index + 1}</td>
                      <td>{schedule.departureDate}</td>
                      <td>{schedule.arrivalDate}</td>
                      <td>{schedule.departureTime}</td>
                      <td>{schedule.arrivalTime}</td>
                      <td>{schedule.duration}</td>
                      <td>{schedule.distance}</td>
                      <td>{schedule.trainName}</td>
                      <td>{schedule.departureStationName}</td>
                      <td>{schedule.arrivalStationName}</td>
                      <td>
                        <button
                          className={styles.actionIcon}
                          onClick={(e) => handleActionDropdownOpen(schedule.id, e)}
                          aria-expanded={openDropdownId === schedule.id}
                        >
                          ⋮
                        </button>
                        {openDropdownId === schedule.id && (
                          <div
                            className={styles.actionDropdown}
                            style={{
                              top: dropdownPosition.current.top,
                              left: dropdownPosition.current.left,
                            }}
                          >
                            <button onClick={() => handleUpdate(schedule)}>Update</button>
                            <button onClick={() => toast.info(JSON.stringify(schedule, null, 2))}>
                              View
                            </button>
                            <button onClick={() => handleDelete(schedule.id)}>Delete</button>
                          </div>
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
                {renderPageButtons}
                <button disabled={page === totalPages - 1 || totalPages === 0} onClick={() => setPage(page + 1)}>
                  Next
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
