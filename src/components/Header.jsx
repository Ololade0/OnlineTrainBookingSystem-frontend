

// // src/components/Header.jsx
// import React from "react";
// import styles from "../styles/Header.module.css";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const Header = () => {
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/login");
//   };

//   return (
//     <header className={styles.header}>
//       <div className={styles.logo}>Ololade TrainBooking</div>
//       <nav className={styles.nav}>
//         <a href="/">Home</a>
//         <a href="/timetable">Train Timetable</a>
//         <a href="/bookings">My Bookings</a>

//         {/* If not authenticated → show login/register */}
//         {!user ? (
//           <>
//             <a href="/login">Login</a>
//             <a href="/register">Register</a>
//           </>
//         ) : (
//           <>
//             {/* Superadmin gets a dashboard link */}
//             {user.role?.includes("SUPERADMIN") && (
//               <a href="/admin/dashboard">Admin Dashboard</a>
//             )}
//             <button onClick={handleLogout} className={styles.logoutBtn}>
//               Logout
//             </button>
//           </>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Header;
// src/components/Header.jsx
import React from "react";
import styles from "../styles/Header.module.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Ololade TrainBooking</div>
      <nav className={styles.nav}>
        <a href="/">Home</a>
        <a href="/timetable">Train Timetable</a>
        <a href="/bookings">My Bookings</a>

        {/* If not authenticated → show login/register */}
        {!auth?.token ? (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        ) : (
          <>
            {/* Show welcome message */}
            {/* <span className={styles.welcomeMsg}>
              Welcome, {auth.email}
            </span> */}

            {/* Superadmin gets a dashboard link */}
            {auth.roles?.includes("SUPERADMIN_ROLE") && (
              <a href="/admin/dashboard">Admin Dashboard</a>
            )}

            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
