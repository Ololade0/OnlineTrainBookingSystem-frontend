// // // src/pages/admin/Dashboard.jsx
// // import React from "react";

// // const AdminDashboard = () => {
// //   return (
// //     <div style={{ padding: "2rem" }}>
// //       <h1>Super Admin Dashboard</h1>
// //       <p>Welcome, Superadmin 👑</p>

// //       <div style={{ marginTop: "2rem" }}>
// //         <ul>
// //           <li>👥 Manage Users</li>
// //           <li>➕ Create New Admin</li>
// //           <li>⚙️ System Settings</li>
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;


// import React from "react";
// import { useAuth } from "../context/AuthContext";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import styles from "../styles/Dashboard.module.css";

// const Dashboard = () => {
//   const { auth } = useAuth();

//   return (
//     <div className={styles.pageWrapper}>
//       <Header />

//       <main className={styles.dashboard}>
//         {/* Sidebar */}
//         <aside className={styles.sidebar}>
//           <h2>Admin Panel</h2>
//           <nav>
//             <ul>
//               <li><a href="/dashboard">Overview</a></li>
//               <li><a href="/dashboard/users">Manage Users</a></li>
//               <li><a href="/dashboard/bookings">Bookings</a></li>
//               <li><a href="/dashboard/reports">Reports</a></li>
//             </ul>
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <section className={styles.content}>
//           <h1>Welcome, {auth?.email || "Admin"} 🎉</h1>
//           <p>Your role: <strong>{auth?.role}</strong></p>

//           <div className={styles.cards}>
//             <div className={styles.card}>
//               <h3>Users</h3>
//               <p>View and manage all registered users.</p>
//             </div>
//             <div className={styles.card}>
//               <h3>Bookings</h3>
//               <p>Track train bookings in real time.</p>
//             </div>
//             <div className={styles.card}>
//               <h3>Reports</h3>
//               <p>Generate and download reports.</p>
//             </div>
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// };



import React from "react";
import styles from "../styles/Dashboard.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Dashboard = () => {
  const cards = [
    { title: "Users", value: 128, color: "#198754" },
    { title: "Revenue", value: "$12,540", color: "#0f5132" },
    { title: "Bookings", value: 87, color: "#20c997" },
    { title: "Feedbacks", value: 23, color: "#4caf50" },
  ];

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <div className={styles.dashboard}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h2>Admin Panel</h2>

          <nav>
            <ul>
              <li className={styles.sectionTitle}>Management</li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/users">Users</a></li>
              <li><a href="/bookings">Bookings</a></li>
              <li><a href="/reports">Reports</a></li>
              <li><a href="/settings">Settings</a></li>
            </ul>

            <ul>
              <li className={styles.sectionTitle}>Operations</li>
              <li><a href="/schedule">Schedule</a></li>
              <li><a href="/trains">Trains</a></li>
              <li><a href="/stations">Stations</a></li>
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main className={styles.content}>
          <h1>Welcome, Super Admin!</h1>
          <p>Overview of your platform metrics.</p>

          <div className={styles.cards}>
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={styles.card}
                style={{ borderTop: `4px solid ${card.color}` }}
              >
                <h3>{card.title}</h3>
                <p className={styles.cardValue}>{card.value}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
