// 4. Fix AuthProvider.js to better handle token logic
// src/auth/AuthProvider.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AxiosInstance from "../api/AxiosInstance.js";

// Buat context
const AuthContext = createContext(null);

// Hook untuk menggunakan context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshAttempted, setRefreshAttempted] = useState(false);

  // Cek status autentikasi saat aplikasi dimuat
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
        console.log("Tidak terautentikasi", error);
      } finally {
        setLoading(false);
        setRefreshAttempted(true);
      }
    };

    checkAuth();
  }, []);

  // Fungsi login
  const login = async (credentials) => {
    const response = await AxiosInstance.post("/login", credentials);
    setUser(response.data.safeUserData);
    setAccessToken(response.data.accessToken);
    return response.data;
  };

  // Fungsi logout
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

  // Value yang akan disediakan ke consumer
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