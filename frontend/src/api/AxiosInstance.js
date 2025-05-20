// src/api/AxiosInstance.js
import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://t7-notes-89-948060519163.us-central1.run.app",
  withCredentials: true,
});

// Add a response interceptor to prevent 401 errors on /token from logging to console
AxiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Don't log expected 401 errors from token endpoint to browser console
    if (error.config?.url === '/token' && error.response?.status === 401) {
      console.log('Silent token check failed as expected - normal for non-authenticated users');
      // Create a custom property to track that we've handled this error
      error.handledSilently = true;
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;