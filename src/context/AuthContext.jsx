// import React, { createContext, useState, useEffect, useContext } from "react";


// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState(() => {
//     const saved = localStorage.getItem("auth");
//     return saved
//       ? JSON.parse(saved)
//       : { token: null, roles: [], email: null };
//   });

//   // Keep localStorage in sync
//   useEffect(() => {
//     if (auth?.token) {
//       localStorage.setItem("auth", JSON.stringify(auth));
//     } else {
//       localStorage.removeItem("auth");
//     }
//   }, [auth]);

//   // Login
//   const login = (token, roles, email) => {
//     setAuth({ token, roles, email }); // roles must be array
//   };

//   // Logout
//   const logout = () => {
//     setAuth({ token: null, roles: [], email: null });
//   };

//   return (
//     <AuthContext.Provider value={{ auth, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook
// export const useAuth = () => useContext(AuthContext);


// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = sessionStorage.getItem("auth"); // <- sessionStorage
    return saved ? JSON.parse(saved) : { token: null, roles: [], email: null };
  });

  useEffect(() => {
    if (auth?.token) {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    } else {
      sessionStorage.removeItem("auth");
    }
  }, [auth]);

  const login = (token, roles = [], email) => {
    setAuth({ token, roles, email });
  };

  const logout = () => {
    setAuth({ token: null, roles: [], email: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
