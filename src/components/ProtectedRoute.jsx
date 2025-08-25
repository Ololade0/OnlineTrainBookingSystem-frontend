// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children, requiredRole }) => {
//   const { user } = useAuth();

//   if (!user?.accessToken) {
//     // Not logged in → redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredRole && !user.roles.includes(requiredRole)) {
//     // Logged in but doesn't have required role → redirect home
//     return <Navigate to="/authorized" replace />;
//   }

//   // Allowed
//   return children;
// };

// export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth } = useAuth(); // ✅ use auth, not user

  if (!auth?.token) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !auth.roles.includes(requiredRole)) {
    // Logged in but doesn't have required role → redirect to Unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed
  return children;
};

export default ProtectedRoute;
