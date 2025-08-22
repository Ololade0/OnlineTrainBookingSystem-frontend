
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/StaffList.module.css";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function StaffList() {
  const { auth } = useAuth();
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/user/getAllNonUserAccounts?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.status?.description || "Failed to fetch staffs");
      }

      setStaffs(data.entity?.content || []);
      setTotalPages(data.entity?.totalPages || 0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchStaffs();
    }
  }, [auth, page]);

  const handleUpdate = (staff) => {
    toast.info(`Update staff: ${staff.lastName} ${staff.firstName}`);
  };

  const handleDelete = (id) => {
    toast.warning(`Delete staff with ID: ${id}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Staff Accounts</h2>

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
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Role(s)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.lastName} {staff.firstName}</td>
                  <td>{staff.email}</td>
                  <td>{staff.phoneNumber || "-"}</td>
                  <td>{staff.gender || "-"}</td>
                  <td>{staff.roleHashSet?.map((r) => r.roleType).join(", ")}</td>
                  <td>
                    <div className={styles.actionWrapper} ref={dropdownRef}>
                      <button
                        className={styles.actionIcon}
                        onClick={() =>
                          setOpenDropdown(openDropdown === staff.id ? null : staff.id)
                        }
                      >
                        ⋮
                      </button>
                      {openDropdown === staff.id && (
                        <div className={styles.actionDropdown}>
                          <button onClick={() => handleUpdate(staff)}>Update</button>
                          <button
                            className={styles.deleteAction}
                            onClick={() => handleDelete(staff.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={page === i ? styles.activePage : ""}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages - 1}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

