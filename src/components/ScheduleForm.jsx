// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/AuthContext";
// import styles from "../styles/ScheduleList.module.css";

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// export default function ScheduleForm({ schedule, onClose }) {
//   const { auth, logout } = useAuth();

//   const [formData, setFormData] = useState({
//     route: "",
//     trainName: "",
//     scheduleType: "",
//     departureDate: "",
//     departureTime: "",
//     arrivalDate: "",
//     arrivalTime: "",
//     duration: "",
//     distance: "",
//     departureStationName: "",
//     arrivalStationName: "",
//   });

//   const [scheduleTypes, setScheduleTypes] = useState([]);
//   const [routes, setRoutes] = useState([]);

//   useEffect(() => {
//     if (!auth?.token) return;

//     const fetchFilters = async () => {
//       try {
//         const [typesRes, routesRes] = await Promise.all([
//           fetch(`${API_BASE}/schedule/get-all-scheduleType`, { headers: { Authorization: `Bearer ${auth?.token}` } }),
//           fetch(`${API_BASE}/schedule/get-all-route`, { headers: { Authorization: `Bearer ${auth?.token}` } }),
//         ]);
//         setScheduleTypes(await typesRes.json());
//         setRoutes(await routesRes.json());
//       } catch {
//         toast.error("Failed to load filters");
//       }
//     };

//     fetchFilters();
//   }, [auth]);

//   useEffect(() => {
//     if (schedule) {
//       setFormData({
//         route: schedule.route || "",
//         trainName: schedule.trainName || "",
//         scheduleType: schedule.scheduleType || "",
//         departureDate: schedule.departureDate || "",
//         departureTime: schedule.departureTime || "",
//         arrivalDate: schedule.arrivalDate || "",
//         arrivalTime: schedule.arrivalTime || "",
//         duration: schedule.duration || "",
//         distance: schedule.distance || "",
//         departureStationName: schedule.departureStationName || "",
//         arrivalStationName: schedule.arrivalStationName || "",
//       });
//     }
//   }, [schedule]);

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const method = schedule ? "PUT" : "POST";
//       const url = schedule ? `${API_BASE}/schedule/update/${schedule.id}` : `${API_BASE}/schedule/create-schedule`;
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth?.token}` },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to save schedule");
//       toast.success(schedule ? "Schedule updated successfully" : "Schedule created successfully");
//       onClose();
//     } catch (err) {
//       if (err.message.includes("Unauthorized")) logout();
//       toast.error(err.message);
//     }
//   };

//   return (
//     <div className={styles.formContainer}>
//       <h2>{schedule ? "Update Schedule" : "Add Schedule"}</h2>
//       <form className={styles.scheduleForm} onSubmit={handleSubmit}>
//         <select name="route" value={formData.route} onChange={handleChange} required>
//           <option value="">Select Route</option>
//           {routes.map((r) => (
//             <option key={r} value={r}>
//               {r}
//             </option>
//           ))}
//         </select>

//         <input
//           type="text"
//           name="trainName"
//           placeholder="Train Name"
//           value={formData.trainName}
//           onChange={handleChange}
//           required
//         />

//         <select name="scheduleType" value={formData.scheduleType} onChange={handleChange} required>
//           <option value="">Select Schedule Type</option>
//           {scheduleTypes.map((t) => (
//             <option key={t} value={t}>
//               {t}
//             </option>
//           ))}
//         </select>

//         <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required />
//         <input type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} required />
//         <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} required />
//         <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} required />

//         <input
//           type="text"
//           name="duration"
//           placeholder="Duration"
//           value={formData.duration}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="distance"
//           placeholder="Distance (e.g., 150.986 km)"
//           value={formData.distance}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="departureStationName"
//           placeholder="Departure Station Name"
//           value={formData.departureStationName}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="arrivalStationName"
//           placeholder="Arrival Station Name"
//           value={formData.arrivalStationName}
//           onChange={handleChange}
//           required
//         />

//         <div className={styles.formActions}>
//           <button type="submit">{schedule ? "Update" : "Add"}</button>
//           <button type="button" onClick={onClose}>
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../styles/ScheduleForm.module.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function ScheduleForm({ onClose }) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = auth?.roles.includes("SUPERADMIN_ROLE");

  const [routes, setRoutes] = useState([]);
  const [trains, setTrains] = useState([]);
  const [scheduleTypes, setScheduleTypes] = useState([]);
  const [stations, setStations] = useState([]);
  const [ageRanges, setAgeRanges] = useState([]);
  const [trainClasses, setTrainClasses] = useState([]);
  const [loading, setLoading] = useState(true);

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
    duration: "",
    distance: "",
    prices: [],
  });

  // Redirect if not superadmin
  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error("Access denied: SUPERADMIN_ROLE required");
      navigate("/login");
    }
  }, [isSuperAdmin, navigate]);

  // Fetch filters
  useEffect(() => {
    if (!auth?.token || !isSuperAdmin) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const [routesRes, trainsRes, typesRes, stationsRes, ageRes] =
          await Promise.all([
            fetch(`${API_BASE}/schedule/get-all-route`, {
              headers: { Authorization: `Bearer ${auth.token}` },
            }),
            fetch(`${API_BASE}/schedule/get-all-train?page=0&size=1000`, {
              headers: { Authorization: `Bearer ${auth.token}` },
            }),
            fetch(`${API_BASE}/schedule/get-all-scheduleType`, {
              headers: { Authorization: `Bearer ${auth.token}` },
            }),
            fetch(`${API_BASE}/station/get-all-station?page=0&size=1000`, {
              headers: { Authorization: `Bearer ${auth.token}` },
            }),
            fetch(`${API_BASE}/admin/get-all-ageRange`, {
              headers: { Authorization: `Bearer ${auth.token}` },
            }),
          ]);

        const [routesData, trainsData, typesData, stationsData, ageData] =
          await Promise.all([
            routesRes.json(),
            trainsRes.json(),
            typesRes.json(),
            stationsRes.json(),
            ageRes.json(),
          ]);

        setRoutes(routesData || []);
        setTrains(trainsData?.content || []);
        setScheduleTypes(typesData || []);
        setStations(stationsData?.content || []);
        setAgeRanges(ageData || []);
      } catch (err) {
        toast.error("Failed to fetch filters");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth, isSuperAdmin]);

  // Fetch train classes when train changes
  useEffect(() => {
    if (!formData.trainId || ageRanges.length === 0) return;

    const fetchClasses = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/train/${formData.trainId}/classes`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        const classes = await res.json();
        setTrainClasses(classes || []);

        const prices = [];
        (classes || []).forEach((cls) => {
          ageRanges.forEach((age) => {
            prices.push({ trainClass: cls, ageRange: age, price: "" });
          });
        });
        setFormData((prev) => ({ ...prev, prices }));
      } catch (err) {
        toast.error("Failed to fetch train classes");
      }
    };

    fetchClasses();
  }, [formData.trainId, ageRanges, auth.token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePriceChange = (idx, value) => {
    const newPrices = [...formData.prices];
    newPrices[idx].price = value;
    setFormData({ ...formData, prices: newPrices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/schedule/create-schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data?.status?.code === 220) {
        toast.error("Unauthorized: Please login");
        logout();
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error(data.message || "Failed to create schedule");
      toast.success("Schedule created successfully");
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className={styles.loading}>Loading filters...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Schedule</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          {/** Floating-label select / input fields **/}
          {[
            { name: "route", label: "Route", type: "select", options: routes },
            { name: "trainId", label: "Train", type: "select", options: trains, valueKey: "id", labelKey: "name" },
            { name: "scheduleType", label: "Schedule Type", type: "select", options: scheduleTypes },
            { name: "departureStationId", label: "Departure Station", type: "select", options: stations, valueKey: "id", labelKey: "name" },
            { name: "arrivalStationId", label: "Arrival Station", type: "select", options: stations, valueKey: "id", labelKey: "name" },
            { name: "departureDate", label: "Departure Date", type: "date" },
            { name: "departureTime", label: "Departure Time", type: "time" },
            { name: "arrivalDate", label: "Arrival Date", type: "date" },
            { name: "arrivalTime", label: "Arrival Time", type: "time" },
            { name: "duration", label: "Duration", type: "text", readOnly: true },
            { name: "distance", label: "Distance", type: "text", readOnly: true },
          ].map((field) => (
            <div key={field.name} className={styles.floatingInput}>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt, i) => (
                    <option
                      key={i}
                      value={field.valueKey ? opt[field.valueKey] : opt}
                    >
                      {field.labelKey ? opt[field.labelKey] : opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  readOnly={field.readOnly || false}
                  required={!field.readOnly}
                />
              )}
              <label>{field.label}</label>
            </div>
          ))}
        </div>

        {/** Price Table **/}
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
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/** Buttons **/}
        <div className={styles.actions}>
          <button type="submit">Create Schedule</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
