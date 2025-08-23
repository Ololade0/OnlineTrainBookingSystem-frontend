
// // export default StaffForm;
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import styles from "../styles/StaffForm.module.css";

// const API_BASE = process.env.REACT_APP_API_BASE_URL;

// const StaffForm = ({ onSuccess }) => {
//   const { auth } = useAuth();
//   const [roles, setRoles] = useState([]);
//   const [idTypes, setIdTypes] = useState([]);
//   const [genders, setGenders] = useState([]);

//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     gender: "",
//     dateOfBirth: "",
//     identificationType: "",
//     idNumber: "",
//     roleType: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Load dropdown options
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const headers = { Authorization: `Bearer ${auth.token}` };
//         const [rolesRes, idTypesRes, gendersRes] = await Promise.all([
//           fetch(`${API_BASE}/role/get-all-roles`, { headers }),
//           fetch(`${API_BASE}/admin/get-all-identificationTypes`, { headers }),
//           fetch(`${API_BASE}/admin/get-all-genders`, { headers }),
//         ]);

//         if (!rolesRes.ok || !idTypesRes.ok || !gendersRes.ok) {
//           throw new Error("Failed to fetch form options");
//         }

//         setRoles(await rolesRes.json());
//         setIdTypes(await idTypesRes.json());
//         setGenders(await gendersRes.json());
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load form options");
//       }
//     };
//     if (auth?.token) fetchData();
//   }, [auth]);

//   // Form validation
//   const validateForm = () => {
//     const newErrors = {};
//     if (!form.firstName.trim()) newErrors.firstName = "First name is required";
//     if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

//     if (!form.email.trim()) newErrors.email = "Email is required";
//     else if (!/^[A-Za-z0-9+_.-]+@(.+)$/.test(form.email))
//       newErrors.email = "Invalid email format";

//     if (!form.phoneNumber.trim())
//       newErrors.phoneNumber = "Phone number is required";

//     if (!form.gender) newErrors.gender = "Gender is required";
//     if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
//     if (!form.identificationType)
//       newErrors.identificationType = "ID type is required";
//     if (!form.idNumber.trim())
//       newErrors.idNumber = "ID number is required";
//     if (!form.roleType) newErrors.roleType = "Role is required";

//     if (!form.password)
//       newErrors.password = "Password is required";
//     else if (
//       !form.password.match(
//         /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/
//       )
//     ) {
//       newErrors.password =
//         "Password must be 8+ chars, include uppercase, lowercase, number & special char.";
//     }

//     if (form.password !== form.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//     if (errors[name]) setErrors({ ...errors, [name]: "" });
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${API_BASE}/user/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success(data.status?.description || "Staff created successfully!");
//         setForm({
//           firstName: "",
//           lastName: "",
//           email: "",
//           phoneNumber: "",
//           password: "",
//           confirmPassword: "",
//           gender: "",
//           dateOfBirth: "",
//           identificationType: "",
//           idNumber: "",
//           roleType: "",
//         });
//         setErrors({});
//         onSuccess?.(); // go back to list & reload
//       } 
//       if (!res.ok) {
//   console.error("Status:", res.status, "Response:", data);
//   toast.error(data.status?.description || "Failed to create staff");
// }

      
//       else {
//          console.error("Status:", res.status, "Response:", data);
//         toast.error(data.status?.description || "Failed to create staff");
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
//         {/* Back button */}
//         <button
//           type="button"
//           className={styles.backButton}
//           onClick={() => onSuccess?.()}
//         >
//           ← Back
//         </button>

//         <h2 className={styles["form-title"]}>Create Staff</h2>

//         <form onSubmit={handleSubmit} className={styles.form} noValidate>
//           {/* First & Last Name */}
//           <div className={styles["form-row"]}>
//             <div
//               className={`${styles["form-group"]} ${
//                 errors.firstName ? styles.error : ""
//               }`}
//             >
//               <label>First Name</label>
//               <input
//                 name="firstName"
//                 value={form.firstName}
//                 onChange={handleChange}
//               />
//               {errors.firstName && (
//                 <span className={styles["error-message"]}>
//                   {errors.firstName}
//                 </span>
//               )}
//             </div>
//             <div
//               className={`${styles["form-group"]} ${
//                 errors.lastName ? styles.error : ""
//               }`}
//             >
//               <label>Last Name</label>
//               <input
//                 name="lastName"
//                 value={form.lastName}
//                 onChange={handleChange}
//               />
//               {errors.lastName && (
//                 <span className={styles["error-message"]}>
//                   {errors.lastName}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Email */}
//           <div
//             className={`${styles["form-group"]} ${
//               errors.email ? styles.error : ""
//             }`}
//           >
//             <label>Email</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//             />
//             {errors.email && (
//               <span className={styles["error-message"]}>{errors.email}</span>
//             )}
//           </div>

//           {/* Phone */}
//           <div
//             className={`${styles["form-group"]} ${
//               errors.phoneNumber ? styles.error : ""
//             }`}
//           >
//             <label>Phone Number</label>
//             <input
//               type="tel"
//               name="phoneNumber"
//               value={form.phoneNumber}
//               onChange={handleChange}
//             />
//             {errors.phoneNumber && (
//               <span className={styles["error-message"]}>
//                 {errors.phoneNumber}
//               </span>
//             )}
//           </div>

//           {/* Gender & DOB */}
//           <div className={styles["form-row"]}>
//             <div
//               className={`${styles["form-group"]} ${
//                 errors.gender ? styles.error : ""
//               }`}
//             >
//               <label>Gender</label>
//               <select
//                 name="gender"
//                 value={form.gender}
//                 onChange={handleChange}
//               >
//                 <option value="">-- Select Gender --</option>
//                 {genders.map((g) => (
//                   <option key={g} value={g}>
//                     {g}
//                   </option>
//                 ))}
//               </select>
//               {errors.gender && (
//                 <span className={styles["error-message"]}>
//                   {errors.gender}
//                 </span>
//               )}
//             </div>
//             <div
//               className={`${styles["form-group"]} ${
//                 errors.dateOfBirth ? styles.error : ""
//               }`}
//             >
//               <label>Date of Birth</label>
//               <input
//                 type="date"
//                 name="dateOfBirth"
//                 value={form.dateOfBirth}
//                 onChange={handleChange}
//               />
//               {errors.dateOfBirth && (
//                 <span className={styles["error-message"]}>
//                   {errors.dateOfBirth}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* ID Type & Number */}
//           <div className={styles["form-row"]}>
//             <div
//               className={`${styles["form-group"]} ${
//                 errors.identificationType ? styles.error : ""
//               }`}
//             >
//               <label>ID Type</label>
//               <select
//                 name="identificationType"
//                 value={form.identificationType}
//                 onChange={handleChange}
//               >
//                 <option value="">-- Select ID Type --</option>
//                 {idTypes.map((id) => (
//                   <option key={id} value={id}>
//                     {id}
//                   </option>
//                 ))}
//               </select>
//               {errors.identificationType && (
//                 <span className={styles["error-message"]}>
//                   {errors.identificationType}
//                 </span>
//               )}
//             </div>
//             <div
//               className={`${styles["form-group"]} ${
//                 errors.idNumber ? styles.error : ""
//               }`}
//             >
//               <label>ID Number</label>
//               <input
//                 name="idNumber"
//                 value={form.idNumber}
//                 onChange={handleChange}
//               />
//               {errors.idNumber && (
//                 <span className={styles["error-message"]}>
//                   {errors.idNumber}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Role */}
//           <div
//             className={`${styles["form-group"]} ${
//               errors.roleType ? styles.error : ""
//             }`}
//           >
//             <label>Role</label>
//             <select
//               name="roleType"
//               value={form.roleType}
//               onChange={handleChange}
//             >
//               <option value="">-- Select Role --</option>
//               {roles.map((r) => (
//                 <option key={r} value={r}>
//                   {r}
//                 </option>
//               ))}
//             </select>
//             {errors.roleType && (
//               <span className={styles["error-message"]}>
//                 {errors.roleType}
//               </span>
//             )}
//           </div>

//           {/* Password & Confirm */}
//           <div className={styles["form-row"]}>
//             <div
//               className={`${styles["form-group"]} ${
//                 errors.password ? styles.error : ""
//               }`}
//             >
//               <label>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//               />
//               {errors.password && (
//                 <span className={styles["error-message"]}>
//                   {errors.password}
//                 </span>
//               )}
//             </div>
//             <div
//               className={`${styles["form-group"]} ${
//                 errors.confirmPassword ? styles.error : ""
//               }`}
//             >
//               <label>Confirm Password</label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//               />
//               {errors.confirmPassword && (
//                 <span className={styles["error-message"]}>
//                   {errors.confirmPassword}
//                 </span>
//               )}
//             </div>
//           </div>

//           <button
//             type="submit"
//             className={styles["submit-btn"]}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Creating..." : "Create Staff"}
//           </button>a
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StaffForm;
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/StaffForm.module.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const StaffForm = ({ onSuccess }) => {
  const { auth } = useAuth();
  const [roles, setRoles] = useState([]);
  const [idTypes, setIdTypes] = useState([]);
  const [genders, setGenders] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    identificationType: "",
    idNumber: "",
    roleType: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${auth.token}` };
        const [rolesRes, idTypesRes, gendersRes] = await Promise.all([
          fetch(`${API_BASE}/role/get-all-roles`, { headers }),
          fetch(`${API_BASE}/admin/get-all-identificationTypes`, { headers }),
          fetch(`${API_BASE}/admin/get-all-genders`, { headers }),
        ]);

        if (!rolesRes.ok || !idTypesRes.ok || !gendersRes.ok) {
          throw new Error("Failed to fetch form options");
        }

        setRoles(await rolesRes.json());
        setIdTypes(await idTypesRes.json());
        setGenders(await gendersRes.json());
      } catch (err) {
        console.error(err);
        toast.error("Failed to load form options");
      }
    };
    if (auth?.token) fetchData();
  }, [auth]);

  // Form validation (client-side)
  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[A-Za-z0-9+_.-]+@(.+)$/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";

    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!form.identificationType)
      newErrors.identificationType = "ID type is required";
    if (!form.idNumber.trim())
      newErrors.idNumber = "ID number is required";
    if (!form.roleType) newErrors.roleType = "Role is required";

    if (!form.password)
      newErrors.password = "Password is required";
    else if (
      !form.password.match(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/
      )
    ) {
      newErrors.password =
        "Password must be 8+ chars, include uppercase, lowercase, number & special char.";
    }

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear previous error on input change
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Success: reset form & show success toast
        toast.success(data.status?.description || data.message || "Staff created successfully!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          gender: "",
          dateOfBirth: "",
          identificationType: "",
          idNumber: "",
          roleType: "",
        });
        setErrors({});
        onSuccess?.();
      } else {
        // 🔥 Backend error handling
        console.error("Status:", res.status, "Response:", data);

        // Map field-level errors if backend returns { fieldName: errorMsg }
        if (typeof data === "object" && !Array.isArray(data)) {
          const fieldErrors = {};
          Object.keys(data).forEach((key) => {
            if (form.hasOwnProperty(key)) {
              fieldErrors[key] = data[key];
            }
          });
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors); // ✅ display inline on form fields
          } else {
            // Show toast for non-field errors
            toast.error(data.message || "Failed to create staff");
          }
        } else {
          toast.error("Failed to create staff");
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

        <h2 className={styles["form-title"]}>Create Staff</h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* First & Last Name */}
          <div className={styles["form-row"]}>
            <div
              className={`${styles["form-group"]} ${errors.firstName ? styles.error : ""}`}
            >
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} />
              {errors.firstName && <span className={styles["error-message"]}>{errors.firstName}</span>}
            </div>

            <div
              className={`${styles["form-group"]} ${errors.lastName ? styles.error : ""}`}
            >
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} />
              {errors.lastName && <span className={styles["error-message"]}>{errors.lastName}</span>}
            </div>
          </div>

          {/* Email */}
          <div className={`${styles["form-group"]} ${errors.email ? styles.error : ""}`}>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className={styles["error-message"]}>{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className={`${styles["form-group"]} ${errors.phoneNumber ? styles.error : ""}`}>
            <label>Phone Number</label>
            <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
            {errors.phoneNumber && <span className={styles["error-message"]}>{errors.phoneNumber}</span>}
          </div>

          {/* Gender & DOB */}
          <div className={styles["form-row"]}>
            <div className={`${styles["form-group"]} ${errors.gender ? styles.error : ""}`}>
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">-- Select Gender --</option>
                {genders.map((g) => (<option key={g} value={g}>{g}</option>))}
              </select>
              {errors.gender && <span className={styles["error-message"]}>{errors.gender}</span>}
            </div>

            <div className={`${styles["form-group"]} ${errors.dateOfBirth ? styles.error : ""}`}>
              <label>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
              {errors.dateOfBirth && <span className={styles["error-message"]}>{errors.dateOfBirth}</span>}
            </div>
          </div>

          {/* ID Type & Number */}
          <div className={styles["form-row"]}>
            <div className={`${styles["form-group"]} ${errors.identificationType ? styles.error : ""}`}>
              <label>ID Type</label>
              <select name="identificationType" value={form.identificationType} onChange={handleChange}>
                <option value="">-- Select ID Type --</option>
                {idTypes.map((id) => (<option key={id} value={id}>{id}</option>))}
              </select>
              {errors.identificationType && <span className={styles["error-message"]}>{errors.identificationType}</span>}
            </div>

            <div className={`${styles["form-group"]} ${errors.idNumber ? styles.error : ""}`}>
              <label>ID Number</label>
              <input name="idNumber" value={form.idNumber} onChange={handleChange} />
              {errors.idNumber && <span className={styles["error-message"]}>{errors.idNumber}</span>}
            </div>
          </div>

          {/* Role */}
          <div className={`${styles["form-group"]} ${errors.roleType ? styles.error : ""}`}>
            <label>Role</label>
            <select name="roleType" value={form.roleType} onChange={handleChange}>
              <option value="">-- Select Role --</option>
              {roles.map((r) => (<option key={r} value={r}>{r}</option>))}
            </select>
            {errors.roleType && <span className={styles["error-message"]}>{errors.roleType}</span>}
          </div>

          {/* Password & Confirm */}
          <div className={styles["form-row"]}>
            <div className={`${styles["form-group"]} ${errors.password ? styles.error : ""}`}>
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} />
              {errors.password && <span className={styles["error-message"]}>{errors.password}</span>}
            </div>

            <div className={`${styles["form-group"]} ${errors.confirmPassword ? styles.error : ""}`}>
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <span className={styles["error-message"]}>{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className={styles["submit-btn"]} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Staff"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;
