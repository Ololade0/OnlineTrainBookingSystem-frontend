
// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "../styles/Login.module.css";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { AuthContext } from "../context/AuthContext";

// /**
//  * Build a correct auth URL regardless of how REACT_APP_API_BASE_URL is set.
//  */
// function buildAuthUrl(endpoint = "login") {
//   const baseRaw = process.env.REACT_APP_API_BASE_URL || "";
//   const base = baseRaw.replace(/\/+$/, ""); // trim trailing slash

//   if (!base) throw new Error("Missing REACT_APP_API_BASE_URL");

//   if (/\/api\/v1\/auth$/.test(base)) return `${base}/${endpoint}`;
//   if (/\/api\/v1$/.test(base)) return `${base}/auth/${endpoint}`;
//   return `${base}/api/v1/auth/${endpoint}`;
// }

// /** Safely parse JSON (won’t throw on empty/non-JSON bodies). */
// function safeParseJson(text) {
//   if (!text) return {};
//   try {
//     return JSON.parse(text);
//   } catch {
//     return {};
//   }
// }

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Pre-fill from "Remember me"
//   useEffect(() => {
//     const savedEmail = localStorage.getItem("rememberEmail");
//     if (savedEmail) {
//       setEmail(savedEmail);
//       setRememberMe(true);
//     }
//   }, []);

//   const validateForm = () => {
//     if (!email.trim() || !password.trim()) {
//       setError("Email and password are required.");
//       return false;
//     }
//     return true;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       const url = buildAuthUrl("login");

//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const raw = await response.text();
//       const data = safeParseJson(raw);

//       if (!response.ok) {
//         const normalizedMsg = (data.message || "").toLowerCase();
//         const errorMessage =
//           data.error === "user_not_found" || normalizedMsg.includes("user not found")
//             ? "No account exists with this email."
//             : data.error === "invalid_password" || normalizedMsg.includes("invalid password")
//             ? "Incorrect password."
//             : data.error === "account_not_verified" || normalizedMsg.includes("not verified")
//             ? "Please verify your account before logging in."
//             : data.message || `Login failed (status ${response.status}).`;

//         throw new Error(errorMessage);
//       }

//       // Accept either "accessToken" (recommended) or "token" (your current backend)
//       const accessToken = data.accessToken ?? data.token;
//       if (!accessToken) {
//         throw new Error("Login succeeded but no token was returned.");
//       }

//       // Save auth in context (also stores in localStorage)
//       login(accessToken, data.role?.[0], data.email);

//       if (rememberMe) {
//         localStorage.setItem("rememberEmail", email);
//       } else {
//         localStorage.removeItem("rememberEmail");
//       }

//       // Redirect based on role
//       if (data.role?.includes("SUPERADMIN_ROLE")) {
//         navigate("/dashboard");
//       } else {
//         navigate("/");
//       }
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
//           {/* Email */}
//           <label>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             autoComplete="username"
//           />

//           {/* Password */}
//           <label>Password</label>
//           <div className={styles.passwordWrapper}>
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               autoComplete="current-password"
//             />
//             <button
//               type="button"
//               className={styles.showHideBtn}
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>

//           {/* Options */}
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

//           {/* Submit */}
//           <button type="submit" className={styles.submitBtn} disabled={loading}>
//             {loading ? (
//               <>
//                 <span className={styles.loader}></span>
//                 <span className={styles.loadingText}>Logging in...</span>
//               </>
//             ) : (
//               "Login"
//             )}
//           </button>

//           {/* Error */}
//           {error && <div className={styles.error}>{error}</div>}

//           {/* Signup */}
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

/**
 * Build a correct auth URL regardless of how REACT_APP_API_BASE_URL is set.
 */
function buildAuthUrl(endpoint = "login") {
  const baseRaw = process.env.REACT_APP_API_BASE_URL || "";
  const base = baseRaw.replace(/\/+$/, ""); // trim trailing slash

  if (!base) throw new Error("Missing REACT_APP_API_BASE_URL");

  if (/\/api\/v1\/auth$/.test(base)) return `${base}/${endpoint}`;
  if (/\/api\/v1$/.test(base)) return `${base}/auth/${endpoint}`;
  return `${base}/api/v1/auth/${endpoint}`;
}

/** Safely parse JSON (won’t throw on empty/non-JSON bodies). */
function safeParseJson(text) {
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill from "Remember me"
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
      const url = buildAuthUrl("login");

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const raw = await response.text();
      const data = safeParseJson(raw);

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

      // Accept either "accessToken" (backend sends this) or "token"
      const accessToken = data.accessToken ?? data.token;
      if (!accessToken) {
        throw new Error("Login succeeded but no token was returned.");
      }

      // Save auth in context (also stores in localStorage)
      login(accessToken, data.roles, data.email);

      // Handle "Remember me"
      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      // Normalize roles to array for safety
      const roles = Array.isArray(data.roles) ? data.roles : [data.roles];

      // Redirect based on role
      if (roles.includes("SUPERADMIN_ROLE")) {
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
          {/* Email */}
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />

          {/* Password */}
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

          {/* Options */}
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

          {/* Submit */}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <span className={styles.loader}></span>
                <span className={styles.loadingText}>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Error */}
          {error && <div className={styles.error}>{error}</div>}

          {/* Signup */}
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
