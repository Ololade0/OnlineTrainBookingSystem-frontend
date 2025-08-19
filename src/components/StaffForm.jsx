// src/components/StaffForm.jsx
import React, { useState, useEffect } from "react";
import styles from "../styles/StaffForm.module.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const StaffForm = () => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    idNumber: "",
    identificationType: "",
    roleType: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch roles
  useEffect(() => {
    fetch(`${BASE_URL}/role/get-all-roles`)
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.message || "Registration failed" });
      } else {
        setMessage({ type: "success", text: data.message });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
          dateOfBirth: "",
          gender: "",
          idNumber: "",
          identificationType: "",
          roleType: "",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h2>Register New Staff</h2>
      {message && (
        <div className={message.type === "error" ? styles.errorMsg : styles.successMsg}>
          {message.text}
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
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
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className={styles.row}>
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
        </div>
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <div className={styles.row}>
          <input
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className={styles.row}>
          <input
            type="text"
            name="identificationType"
            placeholder="ID Type"
            value={formData.identificationType}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="idNumber"
            placeholder="ID Number"
            value={formData.idNumber}
            onChange={handleChange}
            required
          />
        </div>
        <select name="roleType" value={formData.roleType} onChange={handleChange} required>
          <option value="">Select Role</option>
          {roles.map((role, idx) => (
            <option key={idx} value={role}>
              {role.replace("_ROLE", "").replace("_", " ")}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Staff"}
        </button>
      </form>
    </div>
  );
};

export default StaffForm;
