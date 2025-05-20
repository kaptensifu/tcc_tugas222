// src/auth/AuthProvider.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AxiosInstance from "../api/AxiosInstance.js";

// Create context
const AuthContext = createContext(null);

// Hook to use context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshAttempted, setRefreshAttempted] = useState(false);

  // Check authentication status when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...");
        const response = await AxiosInstance.get("/token");
        if (response.data.accessToken) {
          console.log("Got access token from server");
          setAccessToken(response.data.accessToken);
          
          // Fetch user data if needed
          try {
            // Uncomment and implement if you need user data
            // const userResponse = await AxiosInstance.get("/me");
            // setUser(userResponse.data);
          } catch (userError) {
            console.log("Failed to fetch user data", userError);
          }
        }
      } catch (error) {
        // Don't log error details for expected 401 - just handle it silently
        if (error.response && error.response.status === 401) {
          console.log("Not authenticated - user needs to log in");
        } else if (!error.handledSilently) {
          // Only log unexpected errors
          console.log("Authentication check error:", error);
        }
      } finally {
        setLoading(false);
        setRefreshAttempted(true);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    const response = await AxiosInstance.post("/login", credentials);
    setUser(response.data.safeUserData);
    setAccessToken(response.data.accessToken);
    
    // Add a small delay to allow token to be set before any subsequent requests
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return response.data;
  };

  // Logout function
  const logout = async () => {
    try {
      await AxiosInstance.delete("/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      setAccessToken("");
    }
  };

  // Value to be provided to consumers
  const value = {
    user,
    accessToken,
    setAccessToken,
    loading,
    refreshAttempted,
    login,
    logout,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};