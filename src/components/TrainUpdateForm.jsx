import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../styles/TrainUpdate.module.css";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function TrainUpdateForm({ train, onBack, onSuccess }) {
  const { auth } = useAuth();

  const [trainName, setTrainName] = useState("");
  const [trainCode, setTrainCode] = useState("");
  const [trainClasses, setTrainClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Prefill data
  useEffect(() => {
    if (train) {
      setTrainName(train.trainName || "");
      setTrainCode(train.trainCode || "");

      let normalized = (train.trainClasses || []).map((cls) =>
        typeof cls === "string" ? { className: cls } : cls
      );

      if (normalized.length === 0) normalized = [{ className: "" }];
      setTrainClasses(normalized);
    }
  }, [train]);

  // Add new class row
  const addClass = () => {
    setTrainClasses([...trainClasses, { className: "" }]);
  };

  // Remove a class
  const removeClass = (index) => {
    const updated = [...trainClasses];
    updated.splice(index, 1);
    if (updated.length === 0) updated.push({ className: "" });
    setTrainClasses(updated);
  };

  // Handle class input change
  const handleClassChange = (index, value) => {
    const updated = [...trainClasses];
    updated[index] = { className: value };
    setTrainClasses(updated);
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/train/update-train/${train.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({
          trainName,
          trainCode,
          trainClasses: trainClasses.map((c) => c.className),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update train");

      toast.success("Train updated successfully ✅");
      onSuccess();
    } catch (err) {
      toast.error(err.message || "Error updating train ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["form-page"]}>
      <div className={styles["form-container"]}>
        {/* Back button (×) */}
        <button className={styles.closeBtn} onClick={onBack}>
          ×
        </button>

        <h2 className={styles["form-title"]}>Update Train</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles["form-group"]}>
            <label>Train Name</label>
            <input
              type="text"
              value={trainName}
              onChange={(e) => setTrainName(e.target.value)}
              required
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Train Code</label>
            <input
              type="text"
              value={trainCode}
              onChange={(e) => setTrainCode(e.target.value)}
              required
            />
          </div>

          <h3>Train Classes</h3>
          <div className={styles.classList}>
            {trainClasses.map((cls, index) => (
              <div key={index} className={styles.classRow}>
                <input
                  type="text"
                  value={cls.className}
                  onChange={(e) => handleClassChange(index, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeClass(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={styles.addBtn}
            onClick={addClass}
          >
            + Add Class
          </button>

          <button
            type="submit"
            className={styles["submit-btn"]}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Train"}
          </button>
        </form>
      </div>
    </div>
  );
}
