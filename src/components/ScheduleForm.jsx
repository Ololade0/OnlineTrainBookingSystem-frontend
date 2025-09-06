// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import styles from "../styles/ScheduleForm.module.css";

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// export default function ScheduleForm({ onClose }) {
//   const { auth, logout } = useAuth();
//   const navigate = useNavigate();
//   const isSuperAdmin = auth?.roles.includes("SUPERADMIN_ROLE");

//   const [routes, setRoutes] = useState([]);
//   const [trains, setTrains] = useState([]);
//   const [scheduleTypes, setScheduleTypes] = useState([]);
//   const [stations, setStations] = useState([]);
//   const [ageRanges, setAgeRanges] = useState([]);
//   const [trainClasses, setTrainClasses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [formData, setFormData] = useState({
//     route: "",
//     trainId: "",
//     scheduleType: "",
//     departureStationId: "",
//     arrivalStationId: "",
//     departureDate: "",
//     departureTime: "",
//     arrivalDate: "",
//     arrivalTime: "",
//     prices: [],
//   });

//   useEffect(() => {
//     if (!isSuperAdmin) {
//       toast.error("Access denied: SUPERADMIN_ROLE required");
//       navigate("/login");
//     }
//   }, [isSuperAdmin, navigate]);

//   // Fetch filters
//   useEffect(() => {
//     if (!auth?.token || !isSuperAdmin) return;
//     setLoading(true);

//     const fetchData = async () => {
//       try {
//         const [routesRes, trainsRes, typesRes, stationsRes, ageRes] =
//           await Promise.all([
//             fetch(`${API_BASE}/schedule/get-all-route`, {
//               headers: { Authorization: `Bearer ${auth.token}` },
//             }),
//             fetch(`${API_BASE}/train/get-all-train?page=0&size=1000`, {
//               headers: { Authorization: `Bearer ${auth.token}` },
//             }),
//             fetch(`${API_BASE}/schedule/get-all-scheduleType`, {
//               headers: { Authorization: `Bearer ${auth.token}` },
//             }),
//             fetch(`${API_BASE}/station/get-all-station?page=0&size=1000`, {
//               headers: { Authorization: `Bearer ${auth.token}` },
//             }),
//             fetch(`${API_BASE}/admin/get-all-ageRange`, {
//               headers: { Authorization: `Bearer ${auth.token}` },
//             }),
//           ]);

//         const [routesData, trainsData, typesData, stationsData, ageData] =
//           await Promise.all([
//             routesRes.json(),
//             trainsRes.json(),
//             typesRes.json(),
//             stationsRes.json(),
//             ageRes.json(),
//           ]);

//         setRoutes(routesData || []);
//         setTrains(trainsData?.content || []);
//         setScheduleTypes(typesData || []);
//         setStations(stationsData?.content || []);
//         setAgeRanges(ageData || []);
//       } catch (err) {
//         toast.error("Failed to fetch filters");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [auth, isSuperAdmin]);

//   // Fetch train classes when train changes
//   useEffect(() => {
//     if (!formData.trainId || ageRanges.length === 0) return;

//     const fetchClasses = async () => {
//       try {
//         const res = await fetch(
//           `${API_BASE}/train/${formData.trainId}/classes`,
//           { headers: { Authorization: `Bearer ${auth.token}` } }
//         );
//         const classes = await res.json();
//         setTrainClasses(classes || []);

//         const prices = [];
//         (classes || []).forEach((cls) => {
//           ageRanges.forEach((age) => {
//             prices.push({ trainClass: cls, ageRange: age, price: "" });
//           });
//         });
//         setFormData((prev) => ({ ...prev, prices }));
//       } catch (err) {
//         toast.error("Failed to fetch train classes");
//       }
//     };

//     fetchClasses();
//   }, [formData.trainId, ageRanges, auth.token]);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handlePriceChange = (idx, value) => {
//     const newPrices = [...formData.prices];
//     newPrices[idx].price = value;
//     setFormData({ ...formData, prices: newPrices });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`${API_BASE}/schedule/create-schedule`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (data?.status?.code === 220) {
//         toast.error("Unauthorized: Please login");
//         logout();
//         navigate("/login");
//         return;
//       }
//       if (!res.ok) throw new Error(data.message || "Failed to create schedule");
//       toast.success("Schedule created successfully");
//       onClose();
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   if (loading) return <div className={styles.loading}>Loading filters...</div>;

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>Create Schedule</h2>
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <div className={styles.grid}>
//           {[
//             { name: "route", label: "Route", type: "select", options: routes },
//             {
//               name: "trainId",
//               label: "Train",
//               type: "select",
//               options: trains,
//               valueKey: "id",
//               labelKey: "name",
//             },
//             {
//               name: "scheduleType",
//               label: "Schedule Type",
//               type: "select",
//               options: scheduleTypes,
//             },
//             {
//               name: "departureStationId",
//               label: "Departure Station",
//               type: "select",
//               options: stations,
//               valueKey: "id",
//               labelKey: "name",
//             },
//             {
//               name: "arrivalStationId",
//               label: "Arrival Station",
//               type: "select",
//               options: stations,
//               valueKey: "id",
//               labelKey: "name",
//             },
//             { name: "departureDate", label: "Departure Date", type: "date" },
//             { name: "departureTime", label: "Departure Time", type: "time" },
//             { name: "arrivalDate", label: "Arrival Date", type: "date" },
//             { name: "arrivalTime", label: "Arrival Time", type: "time" },
//           ].map((field) => (
//             <div key={field.name} className={styles.floatingInput}>
//               {field.type === "select" ? (
//                 <select
//                   name={field.name}
//                   value={formData[field.name]}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select {field.label}</option>
//                   {field.options.map((opt, i) => (
//                     <option
//                       key={i}
//                       value={field.valueKey ? opt[field.valueKey] : opt}
//                     >
//                       {field.labelKey ? opt[field.labelKey] : opt}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   type={field.type}
//                   name={field.name}
//                   value={formData[field.name]}
//                   onChange={handleChange}
//                   required
//                 />
//               )}
//               <label>{field.label}</label>
//             </div>
//           ))}
//         </div>

//         {/** Price Table **/}
//         {formData.prices.length > 0 && (
//           <div className={styles.priceSection}>
//             <h3>Prices</h3>
//             <div className={styles.priceTable}>
//               <div className={styles.priceHeader}>
//                 <div>Class</div>
//                 <div>Age Range</div>
//                 <div>Price</div>
//               </div>
//               {formData.prices.map((p, idx) => (
//                 <div key={idx} className={styles.priceRow}>
//                   <div>{p.trainClass}</div>
//                   <div>{p.ageRange}</div>
//                   <div>
//                     <input
//                       type="number"
//                       placeholder="Price"
//                       value={p.price}
//                       onChange={(e) => handlePriceChange(idx, e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/** Buttons **/}
//         <div className={styles.actions}>
//           <button type="submit" className={styles.createBtn}>
//             Create Schedule
//           </button>
//           <button type="button" onClick={onClose} className={styles.cancelBtn}>
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
    prices: [],
  });

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
        if (!res.ok) throw new Error("Failed to fetch train classes");
        const classes = await res.json();
        if (!classes || classes.length === 0) {
          toast.error("No classes available for this train");
          setTrainClasses([]);
          setFormData((prev) => ({ ...prev, prices: [] }));
          return;
        }
        setTrainClasses(classes || []);

        const prices = [];
        classes.forEach((cls) => {
          ageRanges.forEach((age) => {
            prices.push({ trainClass: cls, ageRange: age, price: "" });
          });
        });
        setFormData((prev) => ({ ...prev, prices }));
      } catch (err) {
        toast.error("Failed to fetch train classes");
        setTrainClasses([]);
        setFormData((prev) => ({ ...prev, prices: [] }));
      }
    };

    fetchClasses();
  }, [formData.trainId, ageRanges, auth.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "trainId") {
      setFormData((prev) => ({ ...prev, trainId: value, prices: [] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
    // Validate prices
    const invalidPrices = formData.prices.filter(
      (p) => !p.price || isNaN(p.price) || Number(p.price) <= 0
    );
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
          prices: formData.prices.map((p) => ({
            ...p,
            price: Number(p.price), // Ensure price is a number
          })),
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
          {[
            { name: "route", label: "Route", type: "select", options: routes },
            {
              name: "trainId",
              label: "Train",
              type: "select",
              options: trains,
              valueKey: "id",
              labelKey: "name",
            },
            {
              name: "scheduleType",
              label: "Schedule Type",
              type: "select",
              options: scheduleTypes,
            },
            {
              name: "departureStationId",
              label: "Departure Station",
              type: "select",
              options: stations,
              valueKey: "id",
              labelKey: "name",
            },
            {
              name: "arrivalStationId",
              label: "Arrival Station",
              type: "select",
              options: stations,
              valueKey: "id",
              labelKey: "name",
            },
            { name: "departureDate", label: "Departure Date", type: "date" },
            { name: "departureTime", label: "Departure Time", type: "time" },
            { name: "arrivalDate", label: "Arrival Date", type: "date" },
            { name: "arrivalTime", label: "Arrival Time", type: "time" },
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
                  required
                />
              )}
              <label>{field.label}</label>
            </div>
          ))}
        </div>

        {/** Price Table **/}
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

        {/** Buttons **/}
        <div className={styles.actions}>
          <button type="submit" className={styles.createBtn}>
            Create Schedule
          </button>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
