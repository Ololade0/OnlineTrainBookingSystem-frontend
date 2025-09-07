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
    prices: [],
  });

  // Redirect non-superadmin users
  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error("Access denied: SUPERADMIN_ROLE required");
      navigate("/login");
    }
  }, [isSuperAdmin, navigate]);

  // Fetch all filters
  useEffect(() => {
    if (!auth?.token || !isSuperAdmin) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const [routesRes, trainsRes, typesRes, stationsRes, ageRes] = await Promise.all([
          fetch(`${API_BASE}/schedule/get-all-route`, { headers: { Authorization: `Bearer ${auth.token}` } }),
          fetch(`${API_BASE}/train/get-all-train?page=0&size=1000`, { headers: { Authorization: `Bearer ${auth.token}` } }),
          fetch(`${API_BASE}/schedule/get-all-scheduleType`, { headers: { Authorization: `Bearer ${auth.token}` } }),
          fetch(`${API_BASE}/station/get-all-station?page=0&size=1000`, { headers: { Authorization: `Bearer ${auth.token}` } }),
          fetch(`${API_BASE}/admin/get-all-ageRange`, { headers: { Authorization: `Bearer ${auth.token}` } }),
        ]);

        const [routesData, trainsData, typesData, stationsData, ageData] = await Promise.all([
          routesRes.json(),
          trainsRes.json(),
          typesRes.json(),
          stationsRes.json(),
          ageRes.json(),
        ]);

        console.log("Stations data:", stationsData); 
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

  useEffect(() => {
    if (!formData.trainId || ageRanges.length === 0) return;

    const fetchClasses = async () => {
      try {
        const res = await fetch(`${API_BASE}/train/${formData.trainId}/classes`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch train classes");
        const classes = await res.json();
        if (!classes || classes.length === 0) {
          toast.error("No classes available for this train");
          setTrainClasses([]);
          setFormData((prev) => ({ ...prev, prices: [] }));
          return;
        }

        setTrainClasses(classes);
        const prices = classes.flatMap((cls) =>
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (idx, value) => {
    setFormData((prev) => {
      const newPrices = [...prev.prices];
      newPrices[idx] = { ...newPrices[idx], price: value };
      return { ...prev, prices: newPrices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalidPrices = formData.prices.filter((p) => !p.price || isNaN(p.price) || Number(p.price) <= 0);
    if (invalidPrices.length > 0) {
      toast.error("Please enter valid prices for all classes and age ranges");
      return;
    }
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
          {/* Route */}
          <div className={styles.floatingInput}>
            <select name="route" value={formData.route} onChange={handleChange} required>
              <option value="" disabled>Select Route</option>
              {routes.map((r, i) => <option key={i} value={r}>{r}</option>)}
            </select>
            <label>Route</label>
          </div>

          {/* Train */}
          <div className={styles.floatingInput}>
            <select name="trainId" value={formData.trainId} onChange={handleChange} required>
              <option value="" disabled>Select Train</option>
              {trains.length > 0 ? (
                trains.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name || `Train ID: ${t.id}`} {/* Fallback if name is missing */}
                  </option>
                ))
              ) : (
                <option value="" disabled>No trains available</option>
              )}
            </select>
            <label>Train</label>
          </div>

          {/* Schedule Type */}
          <div className={styles.floatingInput}>
            <select name="scheduleType" value={formData.scheduleType} onChange={handleChange} required>
              <option value="" disabled>Select Schedule Type</option>
              {scheduleTypes.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
            <label>Schedule Type</label>
          </div>

          {/* Departure Station */}
          <div className={styles.floatingInput}>
            <select name="departureStationId" value={formData.departureStationId} onChange={handleChange} required>
              <option value="" disabled>Select Departure Station</option>
              {stations.length > 0 ? (
                stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || `Station ID: ${s.id}`} { }
                  </option>
                ))
              ) : (
                <option value="" disabled>No stations available</option>
              )}
            </select>
            <label>Departure Station</label>
          </div>

          {/* Arrival Station */}
          <div className={styles.floatingInput}>
            <select name="arrivalStationId" value={formData.arrivalStationId} onChange={handleChange} required>
              <option value="" disabled>Select Arrival Station</option>
              {stations.length > 0 ? (
                stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || `Station ID: ${s.id}`} {/* Fallback if name is missing */}
                  </option>
                ))
              ) : (
                <option value="" disabled>No stations available</option>
              )}
            </select>
            <label>Arrival Station</label>
          </div>

          {/* Dates and Times */}
          {["departureDate", "departureTime", "arrivalDate", "arrivalTime"].map((field) => (
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
          ))}
        </div>

        {/* Prices */}
        {formData.prices.length > 0 ? (
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
                      aria-label={`Price for ${p.trainClass} - ${p.ageRange}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.noPrices}>
            {formData.trainId
              ? "No classes available for the selected train."
              : "Please select a train to set prices."}
          </div>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.createBtn}>Create Schedule</button>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
        </div>
      </form>
    </div>
  );
}