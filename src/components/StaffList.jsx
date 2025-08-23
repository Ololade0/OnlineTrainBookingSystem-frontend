import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/StaffList.module.css";
import "react-toastify/dist/ReactToastify.css";
import StaffForm from "./StaffForm";
import UserDetailsModal from "./UserDetailsModal";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

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
  const dropdownTriggerRefs = useRef({});
  const dropdownMenuRef = useRef(null);

  const fetchStaffs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/user/getAllNonUserAccounts?page=${page}&size=${size}`,
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.status?.description || "Failed to fetch staffs");
      setStaffs(data.entity?.content || []);
      setTotalPages(data.entity?.totalPages || 0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [auth, page, size]); // Dependencies for fetchStaffs

  const handleClickOutside = useCallback((event) => {
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
  }, [openDropdownId]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setOpenDropdownId(null);
        setSelectedUser(null);
      }
    });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setOpenDropdownId(null);
          setSelectedUser(null);
        }
      });
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (auth?.token && !showForm) {
      fetchStaffs();
    }
  }, [auth, page, showForm, fetchStaffs]); // Include fetchStaffs in dependencies

  const fetchUserById = useCallback(async (id) => {
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
  }, [auth]);

  const handleUpdate = useCallback((staff) => {
    setSelectedUser(staff);
    setShowForm(true);
    setOpenDropdownId(null);
  }, []);

  const handleView = useCallback((staff) => {
    fetchUserById(staff.id);
    setOpenDropdownId(null);
  }, [fetchUserById]);

  const handleDelete = useCallback((id) => {
    toast.warning(`Delete staff with ID: ${id}`);
    setOpenDropdownId(null);
  }, []);

  const handleDropdownOpen = useCallback((id, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownWidth = 120;
    const viewportWidth = window.innerWidth;
    const left = Math.min(rect.right - dropdownWidth, viewportWidth - dropdownWidth - 10);
    setDropdownPosition({ top: rect.bottom + window.scrollY, left });
    setOpenDropdownId(openDropdownId === id ? null : id);
  }, [openDropdownId]);

  const roles = auth?.roles || [];
  // Moved useMemo to top level
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
            <button className={styles.addButton} onClick={() => setShowForm(true)}>
              + Add Staff
            </button>
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
                      <td>{staff.roleHashSet?.map((r) => r.roleType).join(", ") || "-"}</td>
                      <td>
                        <button
                          className={styles.actionIcon}
                          ref={(el) => (dropdownTriggerRefs.current[staff.id] = el)}
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
                      style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
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
        <StaffForm
          staff={selectedUser}
          onSuccess={() => {
            setShowForm(false);
            setSelectedUser(null);
            fetchStaffs();
          }}
        />
      )}
    </div>
  );
}