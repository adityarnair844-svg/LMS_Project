import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    // If not logged in, redirect to login
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
