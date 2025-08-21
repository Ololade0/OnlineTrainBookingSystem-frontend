import React, { createContext, useState, useEffect, useContext } from "react";

// Create context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("auth");
    return saved
      ? JSON.parse(saved)
      : { token: null, roles: [], email: null };
  });

  // Keep localStorage in sync
  useEffect(() => {
    if (auth?.token) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  // Login
  const login = (token, roles, email) => {
    setAuth({ token, roles, email }); // roles must be array
  };

  // Logout
  const logout = () => {
    setAuth({ token: null, roles: [], email: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
