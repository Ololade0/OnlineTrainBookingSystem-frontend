import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/StaffList.module.css";
import "react-toastify/dist/ReactToastify.css";
import StaffForm from "./StaffForm";
import UserDetailsModal from "./UserDetailsModal";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function StaffList() {
  const { auth } = useAuth();

  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [showForm, setShowForm] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState("all"); // 'all' = list all, 'search' = search

  const dropdownTriggerRefs = useRef({});
  const dropdownMenuRef = useRef(null);

  // ✅ Normalize backend response (unwraps entity.content / entity.totalPages)
  const normalizePage = (raw) => {
    if (!raw) return { content: [], totalPages: 0 };
    const entity = raw.entity || raw.data?.entity || raw.result?.entity || raw;
    return {
      content: entity.content || [],
      totalPages: entity.totalPages || 0,
    };
  };

  // ✅ List ALL staffs
  const fetchAllStaffs = useCallback(
    async (pageOverride = page) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE}/user/getAllNonUserAccounts?page=${pageOverride}&size=${size}`,
          { headers: { Authorization: `Bearer ${auth?.token}` } }
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            data.message || data.status?.description || "Failed to fetch staffs"
          );

        const pageData = normalizePage(data);
        setStaffs(pageData.content);
        setTotalPages(pageData.totalPages);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [auth, page, size]
  );

  // 🔎 Search staffs
  const searchStaffs = useCallback(
    async (query, pageOverride = page) => {
      setLoading(true);
      try {
        const queryParams = `query=${encodeURIComponent(
          query
        )}&page=${pageOverride}&size=${size}`;
        const response = await fetch(
          `${API_BASE}/user/searchUsers?${queryParams}`,
          { headers: { Authorization: `Bearer ${auth?.token}` } }
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            data.message || data.status?.description || "Failed to search staffs"
          );

        const pageData = normalizePage(data);
        setStaffs(pageData.content);
        setTotalPages(pageData.totalPages);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [auth, page, size]
  );

  // View details
  const fetchUserById = useCallback(
    async (id) => {
      setLoadingUser(true);
      try {
        const response = await fetch(`${API_BASE}/user/get-user/${id}`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch user");
        setSelectedUser(data);
      } catch (error) {
        toast.error(error.message);
        setSelectedUser(null);
      } finally {
        setLoadingUser(false);
      }
    },
    [auth]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this user?")) return;
      try {
        const response = await fetch(`${API_BASE}/user/delete-user/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to delete user");
        toast.success(data.status?.description || data.message || "Deleted");

        // Refresh list depending on mode
        if (mode === "search" && searchQuery.trim()) {
          searchStaffs(searchQuery, page);
        } else {
          fetchAllStaffs(page);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setOpenDropdownId(null);
      }
    },
    [auth, fetchAllStaffs, mode, page, searchQuery, searchStaffs]
  );

  const handleUpdate = useCallback((staff) => {
    setSelectedUser(staff);
    setShowForm(true);
    setOpenDropdownId(null);
  }, []);

  const handleView = useCallback(
    (staff) => {
      fetchUserById(staff.id);
      setOpenDropdownId(null);
    },
    [fetchUserById]
  );

  const handleDropdownOpen = useCallback(
    (id, event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const dropdownWidth = 120;
      const viewportWidth = window.innerWidth;
      const left = Math.min(
        rect.right - dropdownWidth,
        viewportWidth - dropdownWidth - 10
      );
      setDropdownPosition({ top: rect.bottom + window.scrollY, left });
      setOpenDropdownId(openDropdownId === id ? null : id);
    },
    [openDropdownId]
  );

  const handleClickOutside = useCallback(
    (event) => {
      if (openDropdownId === null) return;
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
    },
    [openDropdownId]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenDropdownId(null);
        setSelectedUser(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [handleClickOutside]);

  // Initial load + whenever page/mode changes and form is not open
  useEffect(() => {
    if (auth?.token && !showForm) {
      if (mode === "search" && searchQuery.trim()) {
        searchStaffs(searchQuery, page);
      } else {
        fetchAllStaffs(page);
      }
    }
  }, [auth, page, showForm, mode, searchQuery, fetchAllStaffs, searchStaffs]);

  // Search click/Enter
  const handleSearch = useCallback(() => {
    const hasQuery = !!searchQuery.trim();
    setPage(0);
    if (hasQuery) {
      setMode("search");
      searchStaffs(searchQuery, 0);
    } else {
      setMode("all");
      fetchAllStaffs(0);
    }
  }, [searchQuery, fetchAllStaffs, searchStaffs]);

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
        <p>You don’t have permission to view staff management.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <UserDetailsModal
        user={selectedUser}
        loading={loadingUser}
        onClose={() => setSelectedUser(null)}
      />

      {!showForm ? (
        <>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Staff Accounts</h2>
            <button
              className={styles.addButton}
              onClick={() => setShowForm(true)}
            >
              + Add Staff
            </button>
          </div>

          <div className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search by Email, Name, or ID Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {loading ? (
            <div className={styles.loader}>
              <div className={styles.spinner}></div>
            </div>
          ) : staffs.length === 0 ? (
            <p className={styles.empty}>No staff found</p>
          ) : (
            <>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Role(s)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffs.map((staff, index) => (
                    <tr key={staff.id}>
                      <td>{page * size + index + 1}</td>
                      <td>
                        {staff.lastName} {staff.firstName}
                      </td>
                      <td>{staff.email}</td>
                      <td>{staff.phoneNumber || "-"}</td>
                      <td>{staff.gender || "-"}</td>
                      <td>
                        {staff.roleHashSet
                          ?.map((r) => r.roleType)
                          .join(", ") || "-"}
                      </td>
                      <td>
                        <button
                          className={styles.actionIcon}
                          ref={(el) =>
                            (dropdownTriggerRefs.current[staff.id] = el)
                          }
                          aria-label="Staff actions"
                          aria-expanded={openDropdownId === staff.id}
                          onClick={(e) => handleDropdownOpen(staff.id, e)}
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
                  const staff = staffs.find((s) => s.id === openDropdownId);
                  return createPortal(
                    <div
                      className={styles.actionDropdown}
                      ref={dropdownMenuRef}
                      style={{
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                      }}
                    >
                      <button onClick={() => handleUpdate(staff)}>Update</button>
                      <button onClick={() => handleView(staff)}>View</button>
                      <button
                        className={styles.deleteAction}
                        onClick={() => handleDelete(staff.id)}
                      >
                        Delete
                      </button>
                    </div>,
                    document.body
                  );
                })()}

              <div className={styles.pagination}>
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
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
        <StaffForm
          staff={selectedUser}
          onSuccess={() => {
            setShowForm(false);
            setSelectedUser(null);
            if (mode === "search" && searchQuery.trim()) {
              searchStaffs(searchQuery, page);
            } else {
              fetchAllStaffs(page);
            }
          }}
        />
      )}
    </div>
  );
}
