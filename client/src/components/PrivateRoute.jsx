// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('token');

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
