import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StationList from "../components/StationList";
import StationForm from "../components/StationForm";

const Dashboard = () => {
  const [mainContentView, setMainContentView] = useState("stationList");
  const [editStationId, setEditStationId] = useState(null);

  const handleEditStation = (stationId) => {
    setEditStationId(stationId);
    setMainContentView("stationForm");
  };

  const handleAddStation = () => {
    setEditStationId(null);
    setMainContentView("stationForm");
  };

  return (
    <DashboardLayout>
      {mainContentView === "stationList" && (
        <StationList
          onAddStation={handleAddStation}
          onEditStation={handleEditStation}
        />
      )}
      {mainContentView === "stationForm" && (
        <StationForm
          stationId={editStationId}
          onSuccess={() => setMainContentView("stationList")}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
