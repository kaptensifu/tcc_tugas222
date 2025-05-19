// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.js";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, refreshAttempted } = useAuth();

  // Tampilkan loading jika masih cek autentikasi dan belum mencoba refresh
  if (loading && !refreshAttempted) {
    return (
      <div className="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
        <div className="container has-text-centered">
          <h1 className="title">Loading...</h1>
          <progress className="progress is-primary" max="100"></progress>
        </div>
      </div>
    );
  }

  // Redirect ke login jika tidak terautentikasi dan sudah mencoba refresh
  if (!isAuthenticated && refreshAttempted) {
    return <Navigate to="/" replace />;
  }

  // Render children jika terautentikasi
  return children;
};

export default ProtectedRoute;