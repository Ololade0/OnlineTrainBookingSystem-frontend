import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/TrainForm.module.css"; // reuse same CSS

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const TrainForm = ({ onSuccess }) => {
  const { auth } = useAuth();

  const [form, setForm] = useState({
    trainName: "",
    trainCode: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ✅ Restrict access: Only SUPERADMIN can view this form
  if (!auth?.token || !auth?.roles?.includes("SUPERADMIN_ROLE")) {
    return (
      <div className={styles["form-page"]}>
        <div className={styles["form-container"]}>
          <h2 className={styles["form-title"]}>🚫 Not Authorized</h2>
          <p>You do not have permission to create Train.</p>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => onSuccess?.()}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.trainName.trim()) newErrors.trainName = "Train name is required";
    if (!form.trainCode.trim()) newErrors.trainCode = "Train code is required";
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
      const res = await fetch(`${API_BASE}/train/create-train`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Train created successfully!");
        setForm({ trainName: "", stationCode: "" });
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
            toast.error(data.message || "Failed to create train");
          }
        } else {
          toast.error("Failed to create train");
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

        <h2 className={styles["form-title"]}>Add Train</h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Station Name */}
          <div className={`${styles["form-group"]} ${errors.trainName ? styles.error : ""}`}>
            <label>Train Name</label>
            <input
              name="trainName"
              value={form.trainName}
              onChange={handleChange}
            />
            {errors.trainName && (
              <span className={styles["error-message"]}>{errors.trainName}</span>
            )}
          </div>

          {/* Station Code */}
          <div className={`${styles["form-group"]} ${errors.trainCode ? styles.error : ""}`}>
            <label>Train Code</label>
            <input
              name="trainCode"
              value={form.trainCode}
              onChange={handleChange}
            />
            {errors.trainCode && (
              <span className={styles["error-message"]}>{errors.trainCode}</span>
            )}
          </div>

          <button type="submit" className={styles["submit-btn"]} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create train"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainForm;
