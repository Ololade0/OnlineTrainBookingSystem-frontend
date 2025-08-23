
// import React, { useEffect, useState, useRef } from "react";
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
//   const [openDropdown, setOpenDropdown] = useState(null);

//   // Pagination state
//   const [page, setPage] = useState(0);
//   const [size] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);

//   // Toggle between list view and form view
//   const [showForm, setShowForm] = useState(false);

//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpenDropdown(null);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const fetchStaffs = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${API_BASE}/user/getAllNonUserAccounts?page=${page}&size=${size}`,
//         {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.status?.description || "Failed to fetch staffs");
//       }

//       setStaffs(data.entity?.content || []);
//       setTotalPages(data.entity?.totalPages || 0);
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (auth?.token && !showForm) {
//       fetchStaffs();
//     }
//   }, [auth, page, showForm]);

//   const handleUpdate = (staff) => {
//     toast.info(`Update staff: ${staff.lastName} ${staff.firstName}`);
//   };

//   const handleDelete = (id) => {
//     toast.warning(`Delete staff with ID: ${id}`);
//   };

//   // 🔹 NEW: role-based restriction
//   // Backend sends roles like: ["SUPERADMIN_ROLE"]
//   const roles = auth?.roles || [];
//   if (!roles.includes("SUPERADMIN_ROLE")) {
//     return (
//       <div className={styles.notAuthorized}>
//         <h2>🚫 Not Authorized</h2>
//         <p>You don’t have permission to view staff management.</p>
//       </div>
//     );
//   }
//   // 🔹 END of new code

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
//                     <th>Full Name</th>
//                     <th>Email</th>
//                     <th>Phone</th>
//                     <th>Gender</th>
//                     <th>Role(s)</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {staffs.map((staff) => (
//                     <tr key={staff.id}>
//                       <td>{staff.lastName} {staff.firstName}</td>
//                       <td>{staff.email}</td>
//                       <td>{staff.phoneNumber || "-"}</td>
//                       <td>{staff.gender || "-"}</td>
//                       <td>{staff.roleHashSet?.map((r) => r.roleType).join(", ")}</td>
//                       <td>
//                         <div className={styles.actionWrapper} ref={dropdownRef}>
//                           <button
//                             className={styles.actionIcon}
//                             onClick={() =>
//                               setOpenDropdown(openDropdown === staff.id ? null : staff.id)
//                             }
//                           >
//                             ⋮
//                           </button>
//                           {openDropdown === staff.id && (
//                             <div className={styles.actionDropdown}>
//                               <button onClick={() => handleUpdate(staff)}>Update</button>
//                               <button
//                                 className={styles.deleteAction}
//                                 onClick={() => handleDelete(staff.id)}
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* Pagination */}
//               <div className={styles.pagination}>
//                 <button
//                   disabled={page === 0}
//                   onClick={() => setPage((prev) => prev - 1)}
//                 >
//                   Previous
//                 </button>

//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i}
//                     className={page === i ? styles.activePage : ""}
//                     onClick={() => setPage(i)}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}

//                 <button
//                   disabled={page === totalPages - 1}
//                   onClick={() => setPage((prev) => prev + 1)}
//                 >
//                   Next
//                 </button>
//               </div>
//             </>
//           )}
//         </>
//       ) : (
//         <StaffForm
//           onSuccess={() => {
//             setShowForm(false);
//             fetchStaffs();
//           }}
//         />
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/StaffList.module.css";
import "react-toastify/dist/ReactToastify.css";
import StaffForm from "./StaffForm";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function StaffList() {
  const { auth } = useAuth();
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Toggle form
  const [showForm, setShowForm] = useState(false);

  const dropdownRefs = useRef({});

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        Object.values(dropdownRefs.current).every(
          (el) => el && !el.contains(event.target)
        )
      ) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    if (auth?.token && !showForm) fetchStaffs();
  }, [auth, page, showForm]);

  const handleUpdate = (staff) => {
    toast.info(`Update staff: ${staff.lastName} ${staff.firstName}`);
  };

  const handleView = (staff) => {
    toast.info(`View staff: ${staff.lastName} ${staff.firstName}`);
  };

  const handleDelete = (id) => {
    toast.warning(`Delete staff with ID: ${id}`);
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

  return (
    <div className={styles.container}>
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
                      <td>{staff.roleHashSet?.map((r) => r.roleType).join(", ")}</td>
                      <td>
                        <div
                          className={styles.actionWrapper}
                          ref={(el) => (dropdownRefs.current[staff.id] = el)}
                        >
                          <button
                            className={styles.actionIcon}
                            onClick={() =>
                              setOpenDropdownId(openDropdownId === staff.id ? null : staff.id)
                            }
                          >
                            ⋮
                          </button>

                          {openDropdownId === staff.id && (
                            <div className={styles.actionDropdown}>
                              <button onClick={() => handleUpdate(staff)}>Update</button>
                              <button onClick={() => handleView(staff)}>View</button>
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
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>
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
          onSuccess={() => {
            setShowForm(false);
            fetchStaffs();
          }}
        />
      )}
    </div>
  );
}
