// src/routes/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isLoggedIn = false; // Replace with actual auth check
  return !isLoggedIn ? children : <Navigate to="/dashboard" />;
};

export default PublicRoute;

