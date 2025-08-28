import React, { useState } from "react";
import styles from "../styles/DashboardLayout.module.css";

import StaffList from "./StaffList";
import StationList from "./StationList";
import TrainList from "./TrainList";
import ScheduleList from "./ScheduleList"; // Import the ScheduleList component
import Layout from "./Layout"; // ✅ import your global layout

const overviewCards = [
  { title: "Staffs", value: 128, color: "#198754" },
  { title: "Revenue", value: "$12,540", color: "#0f5132" },
  { title: "Bookings", value: 87, color: "#20c997" },
  { title: "Feedbacks", value: 23, color: "#4caf50" },
];

const DashboardLayout = () => {
  const [mainContentView, setMainContentView] = useState("dashboard");

  return (
    <Layout>   {/* ✅ Wrap everything with Layout */}
      <div className={styles.pageWrapper}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h2>Admin Dashboard</h2>
          <nav>
            <ul>
              <li className={styles.sectionTitle}>Management</li>
              <li>
                <button
                  className={styles.sidebarButton}
                  onClick={() => setMainContentView("dashboard")}
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
                <button
                  className={styles.sidebarButton}
                  onClick={() => setMainContentView("schedules")} // Set view to schedules
                >
                  Schedule
                </button>
              </li>
              <li>
                <button className={styles.sidebarButton}>Seat</button>
              </li>
              <li>
                <button className={styles.sidebarButton}>Prices</button>
              </li>
              <li>
                <button
                  className={styles.sidebarButton}
                  onClick={() => setMainContentView("trains")}
                >
                  Train
                </button>
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

        {/* Main content area */}
        <main className={styles.content}>
          {mainContentView === "dashboard" && (
            <>
              <h1>Welcome, Super Admin!</h1>
              <p>Overview of your platform metrics.</p>
              <div className={styles.cards}>
                {overviewCards.map((card, idx) => (
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
          {mainContentView === "trains" && <TrainList />}
          {mainContentView === "schedules" && <ScheduleList />} {/* Add ScheduleList component */}
        </main>
      </div>
    </Layout>
  );
};

export default DashboardLayout;