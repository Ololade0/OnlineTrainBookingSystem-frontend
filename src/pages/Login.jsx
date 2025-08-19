
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "../styles/Login.module.css"; // CSS Module
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_BASE_URL}/login`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//         }
//       );

//       // Check if server responded with JSON
//       const contentType = response.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         const text = await response.text();
//         throw new Error(`Server did not return JSON. Response: ${text}`);
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       // Store token in localStorage
//       localStorage.setItem("authToken", data.token);

//       // Optionally store email if "remember me" is checked
//       if (rememberMe) {
//         localStorage.setItem("rememberEmail", email);
//       } else {
//         localStorage.removeItem("rememberEmail");
//       }

//       // Navigate to Home after successful login
//       navigate("/");

//     } catch (err) {
//       setError(err.message || "Something went wrong during login.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.pageWrapper}>
//       <Header />

//       <section className={styles.loginSection}>
//         <h1>Login</h1>
//         <form className={styles.loginForm} onSubmit={handleLogin}>
          
//           {/* Email Input */}
//           <label>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           {/* Password Input with Show/Hide */}
//           <label>Password</label>
//           <div className={styles.passwordWrapper}>
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <button
//               type="button"
//               className={styles.showHideBtn}
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>

//           {/* Remember Me & Forgot Password */}
//           <div className={styles.options}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//               />
//               Remember me
//             </label>
//             <button
//               type="button"
//               className={styles.forgotBtn}
//               onClick={() => navigate("/forgot-password")}
//             >
//               Forgot password?
//             </button>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className={styles.submitBtn}
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>

//           {/* Error Message */}
//           {error && <div className={styles.error}>{error}</div>}

//           {/* Signup Link */}
//           <p className={styles.signupLink}>
//             Don't have an account?{" "}
//             <span onClick={() => navigate("/register")}>Create one</span>
//           </p>
//         </form>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL; 
// 👉 already ends with /api/v1/auth

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const normalizedMsg = (data.message || "").toLowerCase();
        const errorMessage =
          data.error === "user_not_found" || normalizedMsg.includes("user not found")
            ? "No account exists with this email."
            : data.error === "invalid_password" || normalizedMsg.includes("invalid password")
            ? "Incorrect password."
            : data.error === "account_not_verified" || normalizedMsg.includes("not verified")
            ? "Please verify your account before logging in."
            : data.message || `Login failed (status ${response.status}).`;

        throw new Error(errorMessage);
      }

      const accessToken = data.accessToken ?? data.token;
      if (!accessToken) throw new Error("Login succeeded but no token returned.");

      // Save auth in context (and localStorage via AuthContext)
      login(accessToken, data.role?.[0], data.email);

      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      // Redirect based on role
      if (data.role?.includes("SUPERADMIN_ROLE")) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Something went wrong during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <section className={styles.loginSection}>
        <h1>Login</h1>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />

          <label>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.showHideBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className={styles.options}>
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              className={styles.forgotBtn}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <div className={styles.error}>{error}</div>}

          <p className={styles.signupLink}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Create one</span>
          </p>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
