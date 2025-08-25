import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/StaffForm.module.css"; // reuse same CSS

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const StationForm = ({ onSuccess }) => {
  const { auth } = useAuth();

  const [form, setForm] = useState({
    stationName: "",
    stationCode: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.stationName.trim()) newErrors.stationName = "Station name is required";
    if (!form.stationCode.trim()) newErrors.stationCode = "Station code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/station/create`, {
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
        setForm({ stationName: "", stationCode: "" });
        setErrors({});
        onSuccess?.();
      } else {
        // field-level errors
        if (typeof data === "object" && !Array.isArray(data)) {
          const fieldErrors = {};
          Object.keys(data).forEach((key) => {
            if (form.hasOwnProperty(key)) fieldErrors[key] = data[key];
          });
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          } else {
            toast.error(data.message || "Failed to create station");
          }
        } else {
          toast.error("Failed to create station");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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

        <h2 className={styles["form-title"]}>Create Station</h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Station Name */}
          <div className={`${styles["form-group"]} ${errors.stationName ? styles.error : ""}`}>
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

          {/* Station Code */}
          <div className={`${styles["form-group"]} ${errors.stationCode ? styles.error : ""}`}>
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

          <button type="submit" className={styles["submit-btn"]} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Station"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StationForm;
