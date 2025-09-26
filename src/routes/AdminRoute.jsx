// src/routes/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token"); // check if logged in

  return token ? children : <Navigate to="/login" replace />;
};

export default AdminRoute;
