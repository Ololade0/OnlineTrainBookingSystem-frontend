// import React, { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import styles from "../styles/StaffForm.module.css"; // reuse same CSS

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// const StationForm = ({ onSuccess }) => {
//   const { auth } = useAuth();

//   const [form, setForm] = useState({
//     stationName: "",
//     stationCode: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   // ✅ Restrict access: Only SUPERADMIN can view this form
//   if (!auth?.token || !auth?.roles?.includes("SUPERADMIN_ROLE")) {
//     return (
//       <div className={styles["form-page"]}>
//         <div className={styles["form-container"]}>
//           <h2 className={styles["form-title"]}>🚫 Not Authorized</h2>
//           <p>You do not have permission to create stations.</p>
//           <button
//             type="button"
//             className={styles.backButton}
//             onClick={() => onSuccess?.()}
//           >
//             ← Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Validation
//   const validateForm = () => {
//     const newErrors = {};
//     if (!form.stationName.trim()) newErrors.stationName = "Station name is required";
//     if (!form.stationCode.trim()) newErrors.stationCode = "Station code is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });

//     if (errors[name]) setErrors({ ...errors, [name]: "" });
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${API_BASE}/station/create-station`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success(data.message || "Station created successfully!");
//         setForm({ stationName: "", stationCode: "" });
//         setErrors({});
//         onSuccess?.();
//       } else {
//         // field-level errors
//         if (typeof data === "object" && !Array.isArray(data)) {
//           const fieldErrors = {};
//           Object.keys(data).forEach((key) => {
//             if (form.hasOwnProperty(key)) fieldErrors[key] = data[key];
//           });
//           if (Object.keys(fieldErrors).length > 0) {
//             setErrors(fieldErrors);
//           } else {
//             toast.error(data.message || "Failed to create station");
//           }
//         } else {
//           toast.error("Failed to create station");
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className={styles["form-page"]}>
//       <div className={styles["form-container"]}>
//         <button
//           type="button"
//           className={styles.backButton}
//           onClick={() => onSuccess?.()}
//         >
//           ← Back
//         </button>

//         <h2 className={styles["form-title"]}>Create Station</h2>

//         <form onSubmit={handleSubmit} className={styles.form} noValidate>
//           {/* Station Name */}
//           <div className={`${styles["form-group"]} ${errors.stationName ? styles.error : ""}`}>
//             <label>Station Name</label>
//             <input
//               name="stationName"
//               value={form.stationName}
//               onChange={handleChange}
//             />
//             {errors.stationName && (
//               <span className={styles["error-message"]}>{errors.stationName}</span>
//             )}
//           </div>

//           {/* Station Code */}
//           <div className={`${styles["form-group"]} ${errors.stationCode ? styles.error : ""}`}>
//             <label>Station Code</label>
//             <input
//               name="stationCode"
//               value={form.stationCode}
//               onChange={handleChange}
//             />
//             {errors.stationCode && (
//               <span className={styles["error-message"]}>{errors.stationCode}</span>
//             )}
//           </div>

//           <button type="submit" className={styles["submit-btn"]} disabled={isSubmitting}>
//             {isSubmitting ? "Creating..." : "Create Station"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StationForm;


import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../styles/ScheduleForm.module.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function ScheduleForm({ onClose }) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [routes, setRoutes] = useState([]);
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [scheduleTypes, setScheduleTypes] = useState([]);
  const [ageRanges, setAgeRanges] = useState([]);
  const [trainClasses, setTrainClasses] = useState([]);

  const [formData, setFormData] = useState({
    route: "",
    trainId: "",
    scheduleType: "",
    departureStationId: "",
    arrivalStationId: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    prices: [],
  });

  const [errors, setErrors] = useState({});
  const isSuperAdmin = auth?.roles?.includes("SUPERADMIN_ROLE");

  // Redirect unauthorized
  useEffect(() => {
    if (auth && !isSuperAdmin) {
      toast.error("Access denied: SUPERADMIN_ROLE required");
      navigate("/login");
    }
  }, [auth, isSuperAdmin, navigate]);

  // Fetch all filters
  useEffect(() => {
    if (!auth?.token || !isSuperAdmin) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [routesRes, trainsRes, typesRes, stationsRes, ageRes] = await Promise.all([
          fetch(`${API_BASE}/schedule/get-all-route`, { headers: { Authorization: `Bearer ${auth.token}` } }),
          fetch(`${API_BASE}/train/get-all-train?page=0&size=1000`, { headers: { Authorization: `Bearer ${auth.token}` } }),
          fetch(`${API_BASE}/schedule/get-all-scheduleType`, { headers: { Authorization: `Bearer ${auth.token}` } }),
          fetch(`${API_BASE}/station/get-all-station?page=0&size=1000`, { headers: { Authorization: `Bearer ${auth.token}` } }),
          fetch(`${API_BASE}/admin/get-all-ageRange`, { headers: { Authorization: `Bearer ${auth.token}` } }),
        ]);

        // Check backend errors
        const backendErrors = [];
        if (!routesRes.ok) backendErrors.push("Failed to fetch routes");
        if (!trainsRes.ok) backendErrors.push("Failed to fetch trains");
        if (!typesRes.ok) backendErrors.push("Failed to fetch schedule types");
        if (!stationsRes.ok) backendErrors.push("Failed to fetch stations");
        if (!ageRes.ok) backendErrors.push("Failed to fetch age ranges");
        if (backendErrors.length > 0) throw new Error(backendErrors.join(", "));

        // Parse JSON
        const [routesData, trainsData, typesData, stationsData, ageData] = await Promise.all([
          routesRes.json(),
          trainsRes.json(),
          typesRes.json(),
          stationsRes.json(),
          ageRes.json(),
        ]);

        setRoutes(routesData || []);
        setTrains(trainsData?.content || trainsData || []);
        setScheduleTypes(typesData || []);
        setStations(stationsData?.content || stationsData || []);
        setAgeRanges(ageData || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth, isSuperAdmin]);

  // Fetch train classes & prepare prices
  useEffect(() => {
    if (!formData.trainId || ageRanges.length === 0) {
      setTrainClasses([]);
      setFormData((prev) => ({ ...prev, prices: [] }));
      return;
    }

    const fetchClasses = async () => {
      try {
        const res = await fetch(`${API_BASE}/train/${formData.trainId}/classes`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch train classes");

        setTrainClasses(data || []);

        const prices = data.flatMap((cls) =>
          ageRanges.map((age) => ({ trainClass: cls, ageRange: age, price: "" }))
        );
        setFormData((prev) => ({ ...prev, prices }));
      } catch (err) {
        toast.error(err.message);
        setTrainClasses([]);
        setFormData((prev) => ({ ...prev, prices: [] }));
      }
    };

    fetchClasses();
  }, [formData.trainId, ageRanges, auth.token]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePriceChange = (idx, value) => {
    setFormData((prev) => {
      const prices = [...prev.prices];
      prices[idx] = { ...prices[idx], price: value };
      return { ...prev, prices };
    });
    if (errors[`price_${idx}`]) setErrors((prev) => ({ ...prev, [`price_${idx}`]: "" }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    const newErrors = {};
    if (!formData.route) newErrors.route = "Route is required";
    if (!formData.trainId) newErrors.trainId = "Train is required";
    if (!formData.scheduleType) newErrors.scheduleType = "Schedule type is required";
    if (!formData.departureStationId) newErrors.departureStationId = "Departure station is required";
    if (!formData.arrivalStationId) newErrors.arrivalStationId = "Arrival station is required";
    if (!formData.departureDate) newErrors.departureDate = "Departure date is required";
    if (!formData.departureTime) newErrors.departureTime = "Departure time is required";
    if (!formData.arrivalDate) newErrors.arrivalDate = "Arrival date is required";
    if (!formData.arrivalTime) newErrors.arrivalTime = "Arrival time is required";

    formData.prices.forEach((p, idx) => {
      if (!p.price || isNaN(p.price) || Number(p.price) <= 0) {
        newErrors[`price_${idx}`] = "Price must be > 0";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/schedule/create-schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          ...formData,
          prices: formData.prices.map((p) => ({ ...p, price: Number(p.price) })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Map backend field errors
        const backendFieldErrors = {};
        if (typeof data === "object" && !Array.isArray(data)) {
          Object.keys(data).forEach((key) => {
            if (formData.hasOwnProperty(key)) backendFieldErrors[key] = data[key];
          });
          // Prices
          if (Array.isArray(data.prices)) {
            data.prices.forEach((p, idx) => {
              if (p.price) backendFieldErrors[`price_${idx}`] = p.price;
            });
          }
        }
        if (Object.keys(backendFieldErrors).length > 0) {
          setErrors(backendFieldErrors);
        } else {
          toast.error(data.message || "Failed to create schedule");
        }
        return;
      }

      toast.success(data.message || "Schedule created successfully");
      onClose();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading filters...</div>;

  return (
    <div className={styles["form-page"]}>
      <div className={styles["form-container"]}>
        <button type="button" className={styles.backButton} onClick={onClose}>
          ← Back
        </button>
        <h2 className={styles["form-title"]}>Create Schedule</h2>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.grid}>
            {[
              { name: "route", label: "Route", options: routes },
              { name: "trainId", label: "Train", options: trains, valueKey: "id", labelKey: "name" },
              { name: "scheduleType", label: "Schedule Type", options: scheduleTypes },
              { name: "departureStationId", label: "Departure Station", options: stations, valueKey: "id", labelKey: "name" },
              { name: "arrivalStationId", label: "Arrival Station", options: stations, valueKey: "id", labelKey: "name" },
              { name: "departureDate", label: "Departure Date", type: "date" },
              { name: "departureTime", label: "Departure Time", type: "time" },
              { name: "arrivalDate", label: "Arrival Date", type: "date" },
              { name: "arrivalTime", label: "Arrival Time", type: "time" },
            ].map((field) => (
              <div key={field.name} className={`${styles["form-group"]} ${errors[field.name] ? styles.error : ""}`}>
                {Array.isArray(field.options) && field.options.length > 0 ? (
                  <select name={field.name} value={formData[field.name]} onChange={handleChange}>
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt, i) => (
                      <option key={i} value={field.valueKey ? opt[field.valueKey] : opt}>
                        {field.labelKey ? opt[field.labelKey] : opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input type={field.type || "text"} name={field.name} value={formData[field.name]} onChange={handleChange} />
                )}
                <label>{field.label}</label>
                {errors[field.name] && <span className={styles["error-message"]}>{errors[field.name]}</span>}
              </div>
            ))}
          </div>

          {formData.prices.length > 0 && (
            <div className={styles.priceSection}>
              <h3>Prices</h3>
              <div className={styles.priceTable}>
                <div className={styles.priceHeader}>
                  <div>Class</div>
                  <div>Age Range</div>
                  <div>Price</div>
                </div>
                {formData.prices.map((p, idx) => (
                  <div key={idx} className={styles.priceRow}>
                    <div>{p.trainClass}</div>
                    <div>{p.ageRange}</div>
                    <div>
                      <input
                        type="number"
                        placeholder="Price"
                        value={p.price}
                        onChange={(e) => handlePriceChange(idx, e.target.value)}
                        step="0.01"
                        min="0"
                        required
                      />
                      {errors[`price_${idx}`] && <span className={styles["error-message"]}>{errors[`price_${idx}`]}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className={styles["submit-btn"]} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Schedule"}
          </button>
        </form>
      </div>
    </div>
  );
}
