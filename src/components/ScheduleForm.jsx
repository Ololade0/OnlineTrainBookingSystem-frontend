import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/ScheduleList.module.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function ScheduleForm({ schedule, onClose }) {
  const { auth, logout } = useAuth();

  const [formData, setFormData] = useState({
    route: "",
    trainName: "",
    scheduleType: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    duration: "",
    distance: "",
    departureStationName: "",
    arrivalStationName: "",
  });

  const [scheduleTypes, setScheduleTypes] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    if (!auth?.token) return;

    const fetchFilters = async () => {
      try {
        const [typesRes, routesRes] = await Promise.all([
          fetch(`${API_BASE}/schedule/get-all-scheduleType`, { headers: { Authorization: `Bearer ${auth?.token}` } }),
          fetch(`${API_BASE}/schedule/get-all-route`, { headers: { Authorization: `Bearer ${auth?.token}` } }),
        ]);
        setScheduleTypes(await typesRes.json());
        setRoutes(await routesRes.json());
      } catch {
        toast.error("Failed to load filters");
      }
    };

    fetchFilters();
  }, [auth]);

  useEffect(() => {
    if (schedule) {
      setFormData({
        route: schedule.route || "",
        trainName: schedule.trainName || "",
        scheduleType: schedule.scheduleType || "",
        departureDate: schedule.departureDate || "",
        departureTime: schedule.departureTime || "",
        arrivalDate: schedule.arrivalDate || "",
        arrivalTime: schedule.arrivalTime || "",
        duration: schedule.duration || "",
        distance: schedule.distance || "",
        departureStationName: schedule.departureStationName || "",
        arrivalStationName: schedule.arrivalStationName || "",
      });
    }
  }, [schedule]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = schedule ? "PUT" : "POST";
      const url = schedule ? `${API_BASE}/schedule/update/${schedule.id}` : `${API_BASE}/schedule/create-schedule`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth?.token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save schedule");
      toast.success(schedule ? "Schedule updated successfully" : "Schedule created successfully");
      onClose();
    } catch (err) {
      if (err.message.includes("Unauthorized")) logout();
      toast.error(err.message);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>{schedule ? "Update Schedule" : "Add Schedule"}</h2>
      <form className={styles.scheduleForm} onSubmit={handleSubmit}>
        <select name="route" value={formData.route} onChange={handleChange} required>
          <option value="">Select Route</option>
          {routes.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="trainName"
          placeholder="Train Name"
          value={formData.trainName}
          onChange={handleChange}
          required
        />

        <select name="scheduleType" value={formData.scheduleType} onChange={handleChange} required>
          <option value="">Select Schedule Type</option>
          {scheduleTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required />
        <input type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} required />
        <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} required />
        <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} required />

        <input
          type="text"
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
        />
        <input
          type="text"
          name="distance"
          placeholder="Distance (e.g., 150.986 km)"
          value={formData.distance}
          onChange={handleChange}
        />
        <input
          type="text"
          name="departureStationName"
          placeholder="Departure Station Name"
          value={formData.departureStationName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="arrivalStationName"
          placeholder="Arrival Station Name"
          value={formData.arrivalStationName}
          onChange={handleChange}
          required
        />

        <div className={styles.formActions}>
          <button type="submit">{schedule ? "Update" : "Add"}</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
