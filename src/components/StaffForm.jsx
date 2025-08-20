import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import styles from "../styles/StaffForm.module.css";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const StaffForm = () => {
  const { auth } = useAuth();
  const [roles, setRoles] = useState([]); // ✅ will store array of strings now
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

        const rolesData = await rolesRes.json();
        // ✅ Updated here: API returns array of strings, not objects
        setRoles(rolesData);

        const idTypesData = await idTypesRes.json();
        setIdTypes(idTypesData);

        const gendersData = await gendersRes.json();
        setGenders(gendersData);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load form options");
      }
    };

    if (auth?.token) fetchData();
  }, [auth]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!form.identificationType) newErrors.identificationType = "ID type is required";
    if (!form.idNumber.trim()) newErrors.idNumber = "ID number is required";
    if (!form.roleType) newErrors.roleType = "Role is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

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
        toast.success(data.message || "Staff created successfully!");
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
      } else {
        toast.error(data.message || "Failed to create staff");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2 className="form-title">Create Staff</h2>
        <form onSubmit={handleSubmit} className="form" noValidate>
          {/* First & Last Name */}
          <div className="form-row">
            <div className={`form-group ${errors.firstName ? "error" : ""}`}>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
              {errors.firstName && <span id="firstName-error" className="error-message">{errors.firstName}</span>}
            </div>
            <div className={`form-group ${errors.lastName ? "error" : ""}`}>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
              {errors.lastName && <span id="lastName-error" className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          {/* Email */}
          <div className={`form-group ${errors.email ? "error" : ""}`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && <span id="email-error" className="error-message">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className={`form-group ${errors.phoneNumber ? "error" : ""}`}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
            />
            {errors.phoneNumber && <span id="phoneNumber-error" className="error-message">{errors.phoneNumber}</span>}
          </div>

          {/* Gender & DOB */}
          <div className="form-row">
            <div className={`form-group ${errors.gender ? "error" : ""}`}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                aria-describedby={errors.gender ? "gender-error" : undefined}
              >
                <option value="">-- Select Gender --</option>
                {genders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.gender && <span id="gender-error" className="error-message">{errors.gender}</span>}
            </div>
            <div className={`form-group ${errors.dateOfBirth ? "error" : ""}`}>
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
                aria-describedby={errors.dateOfBirth ? "dateOfBirth-error" : undefined}
              />
              {errors.dateOfBirth && <span id="dateOfBirth-error" className="error-message">{errors.dateOfBirth}</span>}
            </div>
          </div>

          {/* ID Type & Number */}
          <div className="form-row">
            <div className={`form-group ${errors.identificationType ? "error" : ""}`}>
              <label htmlFor="identificationType">ID Type</label>
              <select
                id="identificationType"
                name="identificationType"
                value={form.identificationType}
                onChange={handleChange}
                required
                aria-describedby={errors.identificationType ? "identificationType-error" : undefined}
              >
                <option value="">-- Select ID Type --</option>
                {idTypes.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
              {errors.identificationType && <span id="identificationType-error" className="error-message">{errors.identificationType}</span>}
            </div>
            <div className={`form-group ${errors.idNumber ? "error" : ""}`}>
              <label htmlFor="idNumber">ID Number</label>
              <input
                id="idNumber"
                type="text"
                name="idNumber"
                value={form.idNumber}
                onChange={handleChange}
                required
                aria-describedby={errors.idNumber ? "idNumber-error" : undefined}
              />
              {errors.idNumber && <span id="idNumber-error" className="error-message">{errors.idNumber}</span>}
            </div>
          </div>

          {/* ✅ Roles dropdown fixed */}
          <div className={`form-group ${errors.roleType ? "error" : ""}`}>
            <label htmlFor="roleType">Role</label>
            <select
              id="roleType"
              name="roleType"
              value={form.roleType}
              onChange={handleChange}
              required
              aria-describedby={errors.roleType ? "roleType-error" : undefined}
            >
              <option value="">-- Select Role --</option>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option> // ✅ plain strings now
              ))}
            </select>
            {errors.roleType && <span id="roleType-error" className="error-message">{errors.roleType}</span>}
          </div>

          {/* Password & Confirm */}
          <div className="form-row">
            <div className={`form-group ${errors.password ? "error" : ""}`}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && <span id="password-error" className="error-message">{errors.password}</span>}
            </div>
            <div className={`form-group ${errors.confirmPassword ? "error" : ""}`}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              />
              {errors.confirmPassword && <span id="confirmPassword-error" className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Staff"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;
