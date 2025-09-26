// src/routes/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isLoggedIn = true; // Replace with actual auth check
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default AdminRoute;
