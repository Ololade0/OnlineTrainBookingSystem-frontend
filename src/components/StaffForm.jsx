

// import React, { useState, useEffect } from "react";
// import styles from "../styles/StaffForm.module.css";

// const StaffForm = () => {
//   const API_BASE = process.env.REACT_APP_API_BASE_URL;

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     dateOfBirth: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     idNumber: "",
//     gender: "",
//     identificationType: "",
//     roleType: "",
//   });

//   const [roles, setRoles] = useState([]);
//   const [identificationTypes, setIdentificationTypes] = useState([]);
//   const [genders, setGenders] = useState([]);

//   // Fetch dropdown data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [rolesRes, idTypesRes, gendersRes] = await Promise.all([
//           fetch(`${API_BASE}/roles/get-all-roles`),
//           fetch(`${API_BASE}/admin/get-all-identificationTypes`),
//           fetch(`${API_BASE}/admin/get-all-genders`),
//         ]);

//         setRoles(await rolesRes.json());
//         setIdentificationTypes(await idTypesRes.json());
//         setGenders(await gendersRes.json());
//       } catch (error) {
//         console.error("Error fetching dropdown data:", error);
//       }
//     };

//     fetchData();
//   }, [API_BASE]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${API_BASE}/admin/create-staff`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         alert("✅ Staff created successfully!");
//         setFormData({
//           firstName: "",
//           lastName: "",
//           email: "",
//           dateOfBirth: "",
//           phoneNumber: "",
//           password: "",
//           confirmPassword: "",
//           idNumber: "",
//           gender: "",
//           identificationType: "",
//           roleType: "",
//         });
//       } else {
//         const errorMsg = await res.text();
//         alert("❌ Failed to create staff: " + errorMsg);
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   return (
//     <div className={styles.formContainer}>
//       <h2 className={styles.formTitle}>➕ Add Staff</h2>
//       <form onSubmit={handleSubmit} className={styles.formGrid}>
//         <input
//           type="text"
//           name="firstName"
//           placeholder="First Name"
//           value={formData.firstName}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="text"
//           name="lastName"
//           placeholder="Last Name"
//           value={formData.lastName}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email Address"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />


//         <input
//           type="date"
//           name="dateOfBirth"
//           value={formData.dateOfBirth}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="text"
//           name="idNumber"
//           placeholder="ID Number"
//           value={formData.idNumber}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="text"
//           name="phoneNumber"
//           placeholder="Phone Number"
//           value={formData.phoneNumber}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Confirm Password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           required
//         />

//           {/* Gender dropdown */}
//         <select
//           name="gender"
//           value={formData.gender}
//           onChange={handleChange}
//           required
//         >
//           <option value="">-- Select Gender --</option>
//           {genders.map((g, idx) => (
//             <option key={idx} value={g.genderType || g}>
//               {g.genderType || g}
//             </option>
//           ))}
//         </select>
//         <select
//           name="identificationType"
//           value={formData.identificationType}
//           onChange={handleChange}
//           required
//         >
//           <option value="">-- Select ID Type --</option>
//           {identificationTypes.map((type, idx) => (
//             <option key={idx} value={type.identificationType || type}>
//               {type.identificationType || type}
//             </option>
//           ))}
//         </select>

//         <select
//           name="roleType"
//           value={formData.roleType}
//           onChange={handleChange}
//           required
//         >
//           <option value="">-- Select Role --</option>
//           {roles.map((role, idx) => (
//             <option key={idx} value={role.roleType || role}>
//               {role.roleType || role}
//             </option>
//           ))}
//         </select>

//         <button type="submit" className={styles.submitButton}>
//           🚀 Create Staff
//         </button>
//       </form>
//     </div>
//   );
// };

// export default StaffForm;


import React, { useState, useEffect } from "react";
import styles from "../styles/StaffForm.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StaffForm = () => {
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    identificationType: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    idNumber: "",
    roleType: "",
  });

  const [roles, setRoles] = useState([]);
  const [identificationTypes, setIdentificationTypes] = useState([]);
  const [genders, setGenders] = useState([]);

  // Fetch dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, idTypesRes, gendersRes] = await Promise.all([
          fetch(`${API_BASE}/roles/get-all-roles`),
          fetch(`${API_BASE}/admin/get-all-identificationTypes`),
          fetch(`${API_BASE}/admin/get-all-genders`),
        ]);

        setRoles(await rolesRes.json());
        setIdentificationTypes(await idTypesRes.json());
        setGenders(await gendersRes.json());
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchData();
  }, [API_BASE]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "✅ Account successfully created", {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          dateOfBirth: "",
          identificationType: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          idNumber: "",
          roleType: "",
        });
      } else {
        toast.error(data.message || "❌ Sign-up failed due to an unexpected error.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("❌ Network error. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>➕ Add Staff</h2>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Gender --</option>
          {genders.map((g, idx) => (
            <option key={idx} value={g.genderType || g}>
              {g.genderType || g}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />

        <select
          name="identificationType"
          value={formData.identificationType}
          onChange={handleChange}
          required
        >
          <option value="">-- Select ID Type --</option>
          {identificationTypes.map((type, idx) => (
            <option key={idx} value={type.identificationType || type}>
              {type.identificationType || type}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="idNumber"
          placeholder="ID Number"
          value={formData.idNumber}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <select
          name="roleType"
          value={formData.roleType}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Role --</option>
          {roles.map((role, idx) => (
            <option key={idx} value={role.roleType || role}>
              {role.roleType || role}
            </option>
          ))}
        </select>

        <button type="submit" className={styles.submitButton}>
          🚀 Create Staff
        </button>
      </form>

      {/* Toast container for popup notifications */}
      <ToastContainer />
    </div>
  );
};

export default StaffForm;
