
// import React, { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import styles from "../styles/TrainForm.module.css";

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// const TrainForm = ({ onSuccess }) => {
//   const { auth } = useAuth();

//   const [form, setForm] = useState({
//     trainName: "",
//     trainCode: "",
//     trainClasses: [""],
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   if (!auth?.token || !auth?.roles?.includes("SUPERADMIN_ROLE")) {
//     return (
//       <div className={styles["form-page"]}>
//         <div className={styles["form-container"]}>
//           <h2 className={styles["form-title"]}>🚫 Not Authorized</h2>
//           <p>You do not have permission to create Train.</p>
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

//   const validateForm = () => {
//     const newErrors = {};
//     if (!form.trainName.trim()) newErrors.trainName = "Train name is required";
//     if (!form.trainCode.trim()) newErrors.trainCode = "Train code is required";
//     form.trainClasses.forEach((cls, idx) => {
//       if (!cls.trim()) newErrors[`trainClass_${idx}`] = "Class name required";
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//     if (errors[name]) setErrors({ ...errors, [name]: "" });
//   };

//   const handleClassChange = (index, e) => {
//     const { value } = e.target;
//     const updatedClasses = [...form.trainClasses];
//     updatedClasses[index] = value;
//     setForm({ ...form, trainClasses: updatedClasses });
//   };

//   const addClass = () => {
//     setForm({ ...form, trainClasses: [...form.trainClasses, ""] });
//   };

//   const removeClass = (index) => {
//     const updatedClasses = form.trainClasses.filter((_, idx) => idx !== index);
//     setForm({ ...form, trainClasses: updatedClasses });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${API_BASE}/train/create-train`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success(data.message || "Train created successfully!");
//         setForm({ trainName: "", trainCode: "", trainClasses: [""] });
//         setErrors({});
//         onSuccess?.();
//       } else {
//         toast.error(data.message || "Failed to create train");
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

//         <h2 className={styles["form-title"]}>Add Train</h2>

//         <form onSubmit={handleSubmit} className={styles.form} noValidate>
//           <div className={`${styles["form-group"]} ${errors.trainName ? styles.error : ""}`}>
//             <label>Train Name</label>
//             <input name="trainName" value={form.trainName} onChange={handleChange} />
//             {errors.trainName && <span className={styles["error-message"]}>{errors.trainName}</span>}
//           </div>

//           <div className={`${styles["form-group"]} ${errors.trainCode ? styles.error : ""}`}>
//             <label>Train Code</label>
//             <input name="trainCode" value={form.trainCode} onChange={handleChange} />
//             {errors.trainCode && <span className={styles["error-message"]}>{errors.trainCode}</span>}
//           </div>

//           <h3>Train Classes</h3>
//           {form.trainClasses.map((cls, idx) => (
//             <div key={idx} className={styles["form-row"]}>
//               <div className={`${styles["form-group"]} ${errors[`trainClass_${idx}`] ? styles.error : ""}`}>
//                 <label>Class Name</label>
//                 <input
//                   value={cls}
//                   onChange={(e) => handleClassChange(idx, e)}
//                 />
//                 {errors[`trainClass_${idx}`] && (
//                   <span className={styles["error-message"]}>
//                     {errors[`trainClass_${idx}`]}
//                   </span>
//                 )}
//               </div>

//               {form.trainClasses.length > 1 && (
//                 <button type="button" className={styles.removeBtn} onClick={() => removeClass(idx)}>
//                   ❌
//                 </button>
//               )}
//             </div>
//           ))}

//           <button type="button" className={styles.addBtn} onClick={addClass}>
//             ➕ Add Class
//           </button>

//           <button type="submit" className={styles["submit-btn"]} disabled={isSubmitting}>
//             {isSubmitting ? "Creating..." : "Create Train"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TrainForm;


    

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Unauthorized from "../pages/Unauthorized"; // <-- import
import styles from "../styles/TrainForm.module.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const TrainForm = ({ onSuccess }) => {
  const { auth } = useAuth();

  const [form, setForm] = useState({
    trainName: "",
    trainCode: "",
    trainClasses: [""],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔒 If not SUPERADMIN, show Unauthorized page
  if (!auth?.token || !auth?.roles?.includes("SUPERADMIN_ROLE")) {
    return <Unauthorized />;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!form.trainName.trim()) newErrors.trainName = "Train name is required";
    if (!form.trainCode.trim()) newErrors.trainCode = "Train code is required";
    form.trainClasses.forEach((cls, idx) => {
      if (!cls.trim()) newErrors[`trainClass_${idx}`] = "Class name required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleClassChange = (index, e) => {
    const { value } = e.target;
    const updatedClasses = [...form.trainClasses];
    updatedClasses[index] = value;
    setForm({ ...form, trainClasses: updatedClasses });
  };

  const addClass = () => {
    setForm({ ...form, trainClasses: [...form.trainClasses, ""] });
  };

  const removeClass = (index) => {
    const updatedClasses = form.trainClasses.filter((_, idx) => idx !== index);
    setForm({ ...form, trainClasses: updatedClasses });
  };

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
        setForm({ trainName: "", trainCode: "", trainClasses: [""] });
        setErrors({});
        onSuccess?.();
      } else {
        // Map backend error message to form field if possible
        const backendMsg = data.message || "Unexpected error occurred";

        if (backendMsg.includes("Train Name")) {
          setErrors({ trainName: backendMsg });
        } else if (backendMsg.includes("Train code")) {
          setErrors({ trainCode: backendMsg });
        } else if (backendMsg.toLowerCase().includes("class")) {
          setErrors({ trainClasses: backendMsg });
        } else {
          toast.error(backendMsg);
        }
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

        <h2 className={styles["form-title"]}>Add Train</h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div
            className={`${styles["form-group"]} ${
              errors.trainName ? styles.error : ""
            }`}
          >
            <label>Train Name</label>
            <input
              name="trainName"
              value={form.trainName}
              onChange={handleChange}
            />
            {errors.trainName && (
              <span className={styles["error-message"]}>
                {errors.trainName}
              </span>
            )}
          </div>

          <div
            className={`${styles["form-group"]} ${
              errors.trainCode ? styles.error : ""
            }`}
          >
            <label>Train Code</label>
            <input
              name="trainCode"
              value={form.trainCode}
              onChange={handleChange}
            />
            {errors.trainCode && (
              <span className={styles["error-message"]}>
                {errors.trainCode}
              </span>
            )}
          </div>

          <h3>Train Classes</h3>
          {errors.trainClasses && (
            <span className={styles["error-message"]}>
              {errors.trainClasses}
            </span>
          )}

          {form.trainClasses.map((cls, idx) => (
            <div key={idx} className={styles["form-row"]}>
              <div
                className={`${styles["form-group"]} ${
                  errors[`trainClass_${idx}`] ? styles.error : ""
                }`}
              >
                <label>Class Name</label>
                <input
                  value={cls}
                  onChange={(e) => handleClassChange(idx, e)}
                />
                {errors[`trainClass_${idx}`] && (
                  <span className={styles["error-message"]}>
                    {errors[`trainClass_${idx}`]}
                  </span>
                )}
              </div>

              {form.trainClasses.length > 1 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeClass(idx)}
                >
                  ❌
                </button>
              )}
            </div>
          ))}

          <button type="button" className={styles.addBtn} onClick={addClass}>
            ➕ Add Class
          </button>

          <button
            type="submit"
            className={styles["submit-btn"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Train"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainForm;
