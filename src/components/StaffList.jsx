// // StaffPage.jsx
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import StaffForm from "./StaffForm";
// import "../styles/StaffList.module.css";

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// const StaffPage = () => {
//   const { auth } = useAuth();
//   const [staffs, setStaffs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState("list"); // "list" or "form"

//   const fetchStaffs = async () => {
//     if (!auth?.token) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/user/getAllNonUserAccounts`, {
//         headers: { Authorization: `Bearer ${auth.token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         toast.error(data?.status?.description || "Access denied");
//         setStaffs([]);
//         return;
//       }
//       const mappedStaffs = (data.entity || []).map((user) => ({
//         ...user,
//         roles: user.roleHashSet?.map((r) => r.roleType) || ["USER_ROLE"],
//       }));
//       setStaffs(mappedStaffs);
//     } catch (err) {
//       toast.error("Failed to fetch staff list");
//       setStaffs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStaffs();
//   }, [auth]);

//   const handleAddStaffSuccess = () => {
//     setView("list");
//     fetchStaffs();
//   };

//   if (!auth?.token) return <p>Please log in to view this page.</p>;

//   if (view === "form") {
//     return (
//       <div className="staffListPage">
//         <button className="backButton" onClick={() => setView("list")}>
//           ← Back to Staff List
//         </button>
//         <StaffForm onSuccess={handleAddStaffSuccess} />
//       </div>
//     );
//   }

//   return (
//     <div className="staffListPage">
//       <div className="headerRow">
//         <h2>Staff Accounts</h2>
//         <button className="addButton" onClick={() => setView("form")}>
//           Add Staff
//         </button>
//       </div>

//       {loading ? (
//         <div className="loader">Loading...</div>
//       ) : staffs.length === 0 ? (
//         <p>No staff accounts found.</p>
//       ) : (
//         <div className="tableWrapper">
//           <table className="staffTable">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Gender</th>
//                 <th>Phone</th>
//                 <th>DOB</th>
//                 <th>ID Number</th>
//                 <th>Roles</th>
//                 <th>Verified</th>
//               </tr>
//             </thead>
//             <tbody>
//               {staffs.map((staff) => (
//                 <tr key={staff.id}>
//                   <td>{staff.firstName} {staff.lastName}</td>
//                   <td>{staff.email}</td>
//                   <td>{staff.gender}</td>
//                   <td>{staff.phoneNumber}</td>
//                   <td>{staff.dateOfBirth}</td>
//                   <td>{staff.idNumber}</td>
//                   <td>{staff.roles.join(", ")}</td>
//                   <td>{staff.verified ? "Yes" : "No"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StaffPage;
// StaffPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import StaffForm from "./StaffForm";
import styles from "../styles/StaffList.module.css"; // ✅ Use CSS modules

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const StaffPage = () => {
  const { auth } = useAuth();
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" or "form"

  const fetchStaffs = async () => {
    if (!auth?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user/getAllNonUserAccounts`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.status?.description || "Access denied");
        setStaffs([]);
        return;
      }
      const mappedStaffs = (data.entity || []).map((user) => ({
        ...user,
        roles: user.roleHashSet?.map((r) => r.roleType) || ["USER_ROLE"],
      }));
      setStaffs(mappedStaffs);
    } catch (err) {
      toast.error("Failed to fetch staff list");
      setStaffs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [auth]);

  const handleAddStaffSuccess = () => {
    setView("list");
    fetchStaffs();
  };

  if (!auth?.token) return <p>Please log in to view this page.</p>;

  // === FORM VIEW ===
  if (view === "form") {
    return (
      <div className={styles.staffListPage}>
        <button className={styles.backButton} onClick={() => setView("list")}>
          ← Back to Staff List
        </button>
        <StaffForm onSuccess={handleAddStaffSuccess} />
      </div>
    );
  }

  // === STAFF LIST VIEW ===
  return (
    <div className={styles.staffListPage}>
      <div className={styles.headerRow}>
        <h2>Staff Accounts</h2>
        <button className={styles.addButton} onClick={() => setView("form")}>
          Add Staff
        </button>
      </div>

      {loading ? (
        <div className={styles.loader}>Loading...</div>
      ) : staffs.length === 0 ? (
        <p>No staff accounts found.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.staffTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>DOB</th>
                <th>ID Number</th>
                <th>Roles</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.firstName} {staff.lastName}</td>
                  <td>{staff.email}</td>
                  <td>{staff.gender}</td>
                  <td>{staff.phoneNumber}</td>
                  <td>{staff.dateOfBirth}</td>
                  <td>{staff.idNumber}</td>
                  <td>{staff.roles.join(", ")}</td>
                  <td>{staff.verified ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffPage;
