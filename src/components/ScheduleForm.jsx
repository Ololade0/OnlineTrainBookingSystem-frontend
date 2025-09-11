import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../styles/ScheduleForm.module.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function ScheduleForm({ onClose }) {
  const { auth, logout } = useAuth();
  const navigate  = useNavigate();
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
    prices: [],
  });

  // Redirect non-superadmin users
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
            fetch(`${API_BASE}/train/get-all-train?page=0&size=1000`, {
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
        setTrains(trainsData?.content || trainsData || []);
        setScheduleTypes(typesData || []);
        setStations(stationsData?.content || stationsData || []);
        setAgeRanges(ageData || []);
      } catch (err) {
        toast.error("Failed to fetch filters: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth, isSuperAdmin]);

  // Fetch train classes when train selected
  useEffect(() => {
    if (!formData.trainId) return;

    const fetchClasses = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/train/${formData.trainId}/classes`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch train classes");
        const classes = await res.json();
        setTrainClasses(classes || []);
      } catch (err) {
        toast.error(err.message);
        setTrainClasses([]);
      }
    };

    fetchClasses();
  }, [formData.trainId, auth.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Dynamic price handlers
  const addPrice = () => {
    setFormData((prev) => ({
      ...prev,
      prices: [...prev.prices, { trainClass: "", ageRange: "", price: "" }],
    }));
  };

  const removePrice = (idx) => {
    setFormData((prev) => {
      const newPrices = [...prev.prices];
      newPrices.splice(idx, 1);
      return { ...prev, prices: newPrices };
    });
  };

  const handlePriceChange = (idx, field, value) => {
    setFormData((prev) => {
      const newPrices = [...prev.prices];
      newPrices[idx] = { ...newPrices[idx], [field]: value };
      return { ...prev, prices: newPrices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required field validation
    const requiredFields = [
      "trainId",
      "route",
      "scheduleType",
      "departureStationId",
      "arrivalStationId",
      "departureDate",
      "departureTime",
      "arrivalDate",
      "arrivalTime",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(
          `${field.replace(/([A-Z])/g, " $1")} is required`
        );
        return;
      }
    }

    // Station validation
    if (formData.departureStationId === formData.arrivalStationId) {
      toast.error("Departure and arrival station cannot be the same");
      return;
    }

    // Date/time validation
    const depDateTime = new Date(
      `${formData.departureDate}T${formData.departureTime}`
    );
    const arrDateTime = new Date(
      `${formData.arrivalDate}T${formData.arrivalTime}`
    );

    if (depDateTime >= arrDateTime) {
      toast.error("Departure time must be before arrival time");
      return;
    }

    // Price validation
    const invalidPrices = formData.prices.filter(
      (p) => !p.trainClass || !p.ageRange || !p.price || Number(p.price) <= 0
    );
    if (invalidPrices.length > 0) {
      toast.error("Please fill all price rows with valid values");
      return;
    }

    // Build payload
    const payload = {
      trainId: Number(formData.trainId),
      departureStationId: Number(formData.departureStationId),
      arrivalStationId: Number(formData.arrivalStationId),
      departureDate: formData.departureDate,
      arrivalDate: formData.arrivalDate,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      scheduleType: formData.scheduleType,
      route: formData.route,
      prices: formData.prices.map((p) => ({
        trainClass: p.trainClass,
        ageRange: p.ageRange,
        price: Number(p.price),
      })),
    };

    try {
      const res = await fetch(`${API_BASE}/schedule/create-schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(payload),
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
  if (loading) {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
}
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Schedule</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          {/* Route */}
          <div className={styles.floatingInput}>
            <select
              name="route"
              value={formData.route}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Route
              </option>
              {routes.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <label>Route</label>
          </div>

          {/* Train */}
          <div className={styles.floatingInput}>
            <select
              name="trainId"
              value={formData.trainId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Train
              </option>
              {trains.length > 0 ? (
                trains.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.trainName || `Train ID: ${t.id}`}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No trains available
                </option>
              )}
            </select>
            <label>Train</label>
          </div>

          {/* Schedule Type */}
          <div className={styles.floatingInput}>
            <select
              name="scheduleType"
              value={formData.scheduleType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Schedule Type
              </option>
              {scheduleTypes.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <label>Schedule Type</label>
          </div>

          {/* Departure Station */}
          <div className={styles.floatingInput}>
            <select
              name="departureStationId"
              value={formData.departureStationId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Departure Station
              </option>
              {stations.map((s) => (
                <option key={s.stationId} value={s.stationId}>
                  {s.stationName || `Station ID: ${s.stationId}`}
                </option>
              ))}
            </select>
            <label>Departure Station</label>
          </div>

          {/* Arrival Station */}
          <div className={styles.floatingInput}>
            <select
              name="arrivalStationId"
              value={formData.arrivalStationId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Arrival Station
              </option>
              {stations.map((s) => (
                <option key={s.stationId} value={s.stationId}>
                  {s.stationName || `Station ID: ${s.stationId}`}
                </option>
              ))}
            </select>
            <label>Arrival Station</label>
          </div>

          {/* Dates and Times */}
          {["departureDate", "departureTime", "arrivalDate", "arrivalTime"].map(
            (field) => (
              <div key={field} className={styles.floatingInput}>
                <input
                  type={field.includes("Time") ? "time" : "date"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
                <label>{field.replace(/([A-Z])/g, " $1").trim()}</label>
              </div>
            )
          )}
        </div>

        {/* Prices - Dynamic */}
        <div className={styles.priceSection}>
          <h3>Prices</h3>
          {formData.prices.map((p, idx) => (
            <div key={idx} className={styles.priceRow}>
              <select
                value={p.trainClass}
                onChange={(e) =>
                  handlePriceChange(idx, "trainClass", e.target.value)
                }
                required
              >
                <option value="">Select Class</option>
                {trainClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>

              <select
                value={p.ageRange}
                onChange={(e) =>
                  handlePriceChange(idx, "ageRange", e.target.value)
                }
                required
              >
                <option value="">Select Age Range</option>
                {ageRanges.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Price"
                value={p.price}
                onChange={(e) =>
                  handlePriceChange(idx, "price", e.target.value)
                }
                required
              />

              <button
                type="button"
                onClick={() => removePrice(idx)}
                className={styles.removeBtn}
              >
                –
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addPrice}
            className={styles.addBtn}
          >
            + Add Price
          </button>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.createBtn}>
            Create Schedule
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
