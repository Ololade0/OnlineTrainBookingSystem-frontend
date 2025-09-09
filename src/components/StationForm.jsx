import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Unauthorized from "../pages/Unauthorized";
import styles from "../styles/TrainForm.module.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const StationForm = ({ onSuccess }) => {
  const { auth } = useAuth();

  const [form, setForm] = useState({
    stationCode: "",
    stationName: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!auth?.token || !auth?.roles?.includes("SUPERADMIN_ROLE")) {
    return <Unauthorized />;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!form.stationCode.trim()) newErrors.stationCode = "Station code is required";
    if (!form.stationName.trim()) newErrors.stationName = "Station name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/station/create-station`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Station created successfully!");
        setForm({ stationCode: "", stationName: "" });
        setErrors({});
        onSuccess?.();
      } else {
        const backendMsg = data.message || "Unexpected error occurred";
        if (backendMsg.includes("Station Code")) setErrors({ stationCode: backendMsg });
        else if (backendMsg.includes("Station Name")) setErrors({ stationName: backendMsg });
        else toast.error(backendMsg);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles["form-page"]}>
      <div className={styles["form-container"]}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => onSuccess?.()}
        >
          ← Back
        </button>

        <h2 className={styles["form-title"]}>Add Station</h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div
            className={`${styles["form-group"]} ${
              errors.stationCode ? styles.error : ""
            }`}
          >
            <label>Station Code</label>
            <input
              name="stationCode"
              value={form.stationCode}
              onChange={handleChange}
            />
            {errors.stationCode && (
              <span className={styles["error-message"]}>{errors.stationCode}</span>
            )}
          </div>

          <div
            className={`${styles["form-group"]} ${
              errors.stationName ? styles.error : ""
            }`}
          >
            <label>Station Name</label>
            <input
              name="stationName"
              value={form.stationName}
              onChange={handleChange}
            />
            {errors.stationName && (
              <span className={styles["error-message"]}>{errors.stationName}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles["submit-btn"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Station"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StationForm;
