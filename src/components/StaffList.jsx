// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { createPortal } from "react-dom";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import styles from "../styles/StaffList.module.css";
// import "react-toastify/dist/ReactToastify.css";
// import StaffForm from "./StaffForm";

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// export default function StaffList() {
//   const { auth } = useAuth();
//   const [staffs, setStaffs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [openDropdownId, setOpenDropdownId] = useState(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

//   const [page, setPage] = useState(0);
//   const [size] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);

//   const [showForm, setShowForm] = useState(false);
//   const dropdownRefs = useRef({});

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [loadingUser, setLoadingUser] = useState(false); // Added: loading state for user details


//   const handleClickOutside = useCallback((event) => {
//     if (
//       Object.values(dropdownRefs.current).every(
//         (el) => el && !el.contains(event.target)
//       )
//     ) {
//       setOpenDropdownId(null);
//     }
//   }, []);

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [handleClickOutside]);

//   const fetchStaffs = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${API_BASE}/user/getAllNonUserAccounts?page=${page}&size=${size}`,
//         {
//           headers: { Authorization: `Bearer ${auth?.token}` },
//         }
//       );
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.status?.description || "Failed to fetch staffs");
//       setStaffs(data.entity?.content || []);
//       setTotalPages(data.entity?.totalPages || 0);
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

// useEffect(() => {
//     if (auth?.token && !showForm) fetchStaffs();
//   }, [auth, page, showForm]);

//   // Fetch single user by ID for View modal
//   const fetchUserById = async (id) => {
//     setLoadingUser(true);
//     try {
//       const response = await fetch(`${API_BASE}/user/${userId}`, {
//         headers: { Authorization: `Bearer ${auth?.token}` },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch user");
//       setSelectedUser(data); // Added: store user for modal
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoadingUser(false);
//     }
//   };

//   const handleUpdate = (staff) => {
//     toast.info(`Update staff: ${staff.lastName} ${staff.firstName}`);
//     setOpenDropdownId(null);
//   };
//   const handleView = (staff) => {
//     fetchUserById(staff.id); // Added: fetch user on view
//     setOpenDropdownId(null);
//   };

//   const handleDelete = (id) => {
//     toast.warning(`Delete staff with ID: ${id}`);
//     setOpenDropdownId(null);
//   };

//   const handleDropdownOpen = (id, event) => {
//     const rect = event.currentTarget.getBoundingClientRect();
//     setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.right - 120 });
//     setOpenDropdownId(openDropdownId === id ? null : id);
//   };

//   const roles = auth?.roles || [];
//   if (!roles.includes("SUPERADMIN_ROLE")) {
//     return (
//       <div className={styles.notAuthorized}>
//         <h2>🚫 Not Authorized</h2>
//         <p>You don’t have permission to view staff management.</p>
//       </div>
//     );
//   }

//   const renderPageButtons = () => {
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
//   };

//   return (
//     <div className={styles.container}>
//       {!showForm ? (
//         <>
//           <div className={styles.headerRow}>
//             <h2 className={styles.title}>Staff Accounts</h2>
//             <button className={styles.addButton} onClick={() => setShowForm(true)}>
//               + Add Staff
//             </button>
//           </div>

//           {loading ? (
//             <div className={styles.loader}>
//               <div className={styles.spinner}></div>
//             </div>
//           ) : staffs.length === 0 ? (
//             <p className={styles.empty}>No staff found</p>
//           ) : (
//             <>
//               <table className={styles.table}>
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Full Name</th>
//                     <th>Email</th>
//                     <th>Phone</th>
//                     <th>Gender</th>
//                     <th>Role(s)</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {staffs.map((staff, index) => (
//                     <tr key={staff.id}>
//                       <td>{page * size + index + 1}</td>
//                       <td>{staff.lastName} {staff.firstName}</td>
//                       <td>{staff.email}</td>
//                       <td>{staff.phoneNumber || "-"}</td>
//                       <td>{staff.gender || "-"}</td>
//                       <td>{staff.roleHashSet?.map(r => r.roleType).join(", ") || "-"}</td>
//                       <td>
//                         <button
//                           className={styles.actionIcon}
//                           onClick={(e) => handleDropdownOpen(staff.id, e)}
//                         >
//                           ⋮
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* Portal dropdown */}
//               {openDropdownId && (() => {
//                 const staff = staffs.find(s => s.id === openDropdownId);
//                 return createPortal(
//                   <div
//                     className={styles.actionDropdown}
//                     style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
//                   >
//                     <button onClick={() => handleUpdate(staff)}>Update</button>
//                     <button onClick={() => handleView(staff)}>View</button>
//                     <button className={styles.deleteAction} onClick={() => handleDelete(staff.id)}>Delete</button>
//                   </div>,
//                   document.body
//                 );
//               })()}

//               <div className={styles.pagination}>
//                 <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
//                 {renderPageButtons()}
//                 <button disabled={page === totalPages - 1 || totalPages === 0} onClick={() => setPage(page + 1)}>Next</button>
//               </div>
//             </>
//           )}
//         </>
//       ) : (
//         <StaffForm onSuccess={() => { setShowForm(false); fetchStaffs(); }} />
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/StaffList.module.css";
import "react-toastify/dist/ReactToastify.css";
import StaffForm from "./StaffForm";
import UserDetailsModal from "./UserDetailsModal"; // Added: modal component

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function StaffList() {
  const { auth } = useAuth();
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Toggle form
  const [showForm, setShowForm] = useState(false);

  // Selected user for View modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false); // Added: loading state for user details

  const dropdownRefs = useRef({});

  // Close dropdown on outside click
  const handleClickOutside = useCallback((event) => {
    if (
      Object.values(dropdownRefs.current).every(
        (el) => el && !el.contains(event.target)
      )
    ) {
      setOpenDropdownId(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Fetch paginated staff list
  const fetchStaffs = async () => {
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
  };

  useEffect(() => {
    if (auth?.token && !showForm) fetchStaffs();
  }, [auth, page, showForm]);

  // Fetch single user by ID for View modal
  const fetchUserById = async (id) => {
    setLoadingUser(true);
    try {
      const response = await fetch(`${API_BASE}/user/${id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user");
      setSelectedUser(data); // Added: store user for modal
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingUser(false);
    }
  };

  // Action handlers
  const handleUpdate = (staff) => {
    toast.info(`Update staff: ${staff.lastName} ${staff.firstName}`);
    setOpenDropdownId(null); // auto-close dropdown
  };

  const handleView = (staff) => {
    fetchUserById(staff.id); // Added: fetch user on view
    setOpenDropdownId(null);
  };

  const handleDelete = (id) => {
    toast.warning(`Delete staff with ID: ${id}`);
    setOpenDropdownId(null);
  };

  // Open dropdown and calculate portal position
  const handleDropdownOpen = (id, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.right - 120 });
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Role restriction
  const roles = auth?.roles || [];
  if (!roles.includes("SUPERADMIN_ROLE")) {
    return (
      <div className={styles.notAuthorized}>
        <h2>🚫 Not Authorized</h2>
        <p>You don’t have permission to view staff management.</p>
      </div>
    );
  }

  // Pagination helper
  const renderPageButtons = () => {
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
  };

  return (
    <div className={styles.container}>
      {/* Added: User Details Modal */}
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
                      <td>{staff.lastName} {staff.firstName}</td>
                      <td>{staff.email}</td>
                      <td>{staff.phoneNumber || "-"}</td>
                      <td>{staff.gender || "-"}</td>
                      <td>{staff.roleHashSet?.map(r => r.roleType).join(", ") || "-"}</td>
                      <td>
                        <button
                          className={styles.actionIcon}
                          onClick={(e) => handleDropdownOpen(staff.id, e)}
                        >
                          ⋮
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Dropdown rendered via portal */}
              {openDropdownId && (() => {
                const staff = staffs.find(s => s.id === openDropdownId);
                return createPortal(
                  <div
                    className={styles.actionDropdown}
                    style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                  >
                    <button onClick={() => handleUpdate(staff)}>Update</button>
                    <button onClick={() => handleView(staff)}>View</button>
                    <button className={styles.deleteAction} onClick={() => handleDelete(staff.id)}>Delete</button>
                  </div>,
                  document.body
                );
              })()}

              <div className={styles.pagination}>
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                {renderPageButtons()}
                <button disabled={page === totalPages - 1 || totalPages === 0} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </>
          )}
        </>
      ) : (
        <StaffForm onSuccess={() => { setShowForm(false); fetchStaffs(); }} />
      )}
    </div>
  );
}
