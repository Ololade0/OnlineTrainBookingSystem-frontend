import React from "react";
import Layout from "../components/Layout";

const Timetable = () => {
  return (
    <Layout>
      <section style={{ textAlign: "center", padding: "4rem 0" }}>
        <h1 style={{ fontSize: "2rem", color: "#047857", marginBottom: "1rem" }}>
          Train Timetable 📅
        </h1>
        <p style={{ color: "#4b5563", fontSize: "1.1rem" }}>
          Browse upcoming routes and schedules here.
        </p>
      </section>
    </Layout>
  );
};

export default Timetable;
