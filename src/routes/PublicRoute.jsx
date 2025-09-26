// src/routes/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token); // check if logged in

  return !token ? children : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
