// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.js";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, refreshAttempted } = useAuth();

  // Show loading if still checking authentication and haven't tried refresh
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

  // Redirect to login if not authenticated and already tried refresh
  if (!isAuthenticated && refreshAttempted) {
    console.log("Not authenticated, redirecting to login page");
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;