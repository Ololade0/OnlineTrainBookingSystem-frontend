
// export default SeatGenerationForm;
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import styles from "../styles/SeatGenerationForm.module.css";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const SeatGenerationForm = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [trains, setTrains] = useState([]);
  const [selectedTrainId, setSelectedTrainId] = useState("");
  const [trainClasses, setTrainClasses] = useState([]);
  const [seatRanges, setSeatRanges] = useState([
    { trainClass: "", startSeat: "", endSeat: "" },
  ]);

  // Check auth and role on mount
  useEffect(() => {
    if (!auth?.token) {
      toast.error("You must be logged in.");
      navigate("/login");
      return;
    }
    if (!auth.roles.includes("SUPERADMIN_ROLE")) {
      toast.error("You are not authorized to access this page.");
      navigate("/login");
      return;
    }
    fetchTrains();
  }, []);

  // Fetch all trains
  const fetchTrains = async () => {
    try {
      const res = await fetch(`${API_BASE}/train/get-all-train?page=0&size=50`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch trains");
      }
      const data = await res.json();
      setTrains(data.content || []); // Use content array from paginated response
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fetch classes for selected train
  const fetchTrainClasses = async (trainId) => {
    if (!trainId) return;
    try {
      const res = await fetch(`${API_BASE}/train/${trainId}/classes`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch train classes");
      }
      const data = await res.json();
      setTrainClasses(data || []); // backend should return array of enums
    } catch (err) {
      toast.error(err.message);
      setTrainClasses([]);
    }
  };

  // Fetch train classes whenever selectedTrainId changes
  useEffect(() => {
    if (selectedTrainId) {
      fetchTrainClasses(selectedTrainId);
    } else {
      setTrainClasses([]);
    }
    setSeatRanges([{ trainClass: "", startSeat: "", endSeat: "" }]); // reset ranges
  }, [selectedTrainId]);

  const addSeatRange = () => {
    setSeatRanges([...seatRanges, { trainClass: "", startSeat: "", endSeat: "" }]);
  };

  const handleChange = (index, field, value) => {
    const newRanges = [...seatRanges];
    newRanges[index][field] = value;
    setSeatRanges(newRanges);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTrainId) {
      toast.error("Please select a train.");
      return;
    }

    const payload = seatRanges.map((r) => ({
      trainClass: r.trainClass,
      startSeat: parseInt(r.startSeat),
      endSeat: parseInt(r.endSeat),
    }));

    try {
      const res = await fetch(`${API_BASE}/seat/generate?trainId=${selectedTrainId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401) {
        toast.error(data.message || "Session expired. Please log in again.");
        logout();
        navigate("/login");
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate seats");
      }

      toast.success("Seats generated successfully!");
      setSeatRanges([{ trainClass: "", startSeat: "", endSeat: "" }]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Generate Seats</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Train:</label>
          <select
            value={selectedTrainId}
            onChange={(e) => setSelectedTrainId(e.target.value)}
          >
            <option value="">-- Select Train --</option>
            {trains.map((train) => (
              <option key={train.id} value={train.id}>
                {train.trainName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.seatRanges}>
          <h4>Train Classes</h4>
          {seatRanges.map((range, index) => (
            <div key={index} className={styles.rangeRow}>
              <select
                value={range.trainClass}
                onChange={(e) => handleChange(index, "trainClass", e.target.value)}
              >
                <option value="">-- Class --</option>
                {trainClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Start Seat"
                value={range.startSeat}
                onChange={(e) => handleChange(index, "startSeat", e.target.value)}
                min="1"
              />
              <input
                type="number"
                placeholder="End Seat"
                value={range.endSeat}
                onChange={(e) => handleChange(index, "endSeat", e.target.value)}
                min="1"
              />
            </div>
          ))}
          <button type="button" className={styles.addBtn} onClick={addSeatRange}>
            Add Class Range
          </button>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Generate Seats
        </button>
      </form>
    </div>
  );
};

export default SeatGenerationForm;
