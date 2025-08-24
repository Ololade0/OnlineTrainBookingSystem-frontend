
import React, { useState } from "react";
import styles from "../styles/Dashboard.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StaffList from "../components/StaffList";
import StationList from "../components/StationList";

const Dashboard = () => {
  const [mainContentView, setMainContentView] = useState("overview");

  const cards = [
    { title: "Staffs", value: 128, color: "#198754" },
    { title: "Revenue", value: "$12,540", color: "#0f5132" },
    { title: "Bookings", value: 87, color: "#20c997" },
    { title: "Feedbacks", value: 23, color: "#4caf50" },
  ];

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <div className={styles.dashboard}>
        <aside className={styles.sidebar}>
          <h2>Admin Dashboard</h2>
          <nav>
            <ul>
              <li className={styles.sectionTitle}>Management</li>
              <li>
                <button
                  className={styles.sidebarButton}
                  onClick={() => setMainContentView("overview")}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className={styles.sidebarButton}
                  onClick={() => setMainContentView("staffs")}
                >
                  Staffs
                </button>
              </li>
              <li>
                <button className={styles.sidebarButton}>Bookings</button>
              </li>
              <li>
                <button className={styles.sidebarButton}>Reports</button>
              </li>
              <li>
                <button className={styles.sidebarButton}>Settings</button>
              </li>
            </ul>

            <ul>
              <li className={styles.sectionTitle}>Operations</li>
              <li>
                <button className={styles.sidebarButton}>Schedule</button>
              </li>
              <li>
                <button className={styles.sidebarButton}>Trains</button>
              </li>
              <li>
                <button
                  className={styles.sidebarButton}
                  onClick={() => setMainContentView("stations")}
                >
                  Stations
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className={styles.content}>
          {mainContentView === "overview" && (
            <>
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
            </>
          )}

          {mainContentView === "staffs" && <StaffList />}
          {mainContentView === "stations" && <StationList />}

          {/* {mainContentView === "stations" && <StationForm />} */}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
