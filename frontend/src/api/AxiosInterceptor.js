// src/api/AxiosInterceptor.js
import AxiosInstance from "./AxiosInstance.js";
import { jwtDecode } from "jwt-decode";

// Add flag to prevent infinite loop
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Function to check if an interceptor already exists
const hasInterceptor = (interceptors, interceptorId) => {
  return interceptors.handlers.some(handler => handler.id === interceptorId);
};

// Custom interceptor IDs for tracking
const REQUEST_INTERCEPTOR_ID = 'auth-request-interceptor';
const RESPONSE_INTERCEPTOR_ID = 'auth-response-interceptor';

// Wrap in function to be imported and used by AuthProvider
export const setupInterceptors = (accessToken, setAccessToken) => {
  console.log("Setting up interceptors with token:", accessToken ? "Present" : "None");
  
  // Clear any existing interceptors to prevent duplicates
  AxiosInstance.interceptors.request.handlers.forEach((handler, index) => {
    if (handler && handler.id === REQUEST_INTERCEPTOR_ID) {
      AxiosInstance.interceptors.request.eject(handler);
    }
  });
  
  AxiosInstance.interceptors.response.handlers.forEach((handler, index) => {
    if (handler && handler.id === RESPONSE_INTERCEPTOR_ID) {
      AxiosInstance.interceptors.response.eject(handler);
    }
  });
  
  // Request interceptor
  AxiosInstance.interceptors.request.use(
    async (config) => {
      // Don't try to refresh token for refresh token or login requests
      if (config.url === "/token" || config.url === "/login" || config.url === "/register") {
        return config;
      }
      
      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;
          
          // Check if token is expired or about to expire (30 seconds buffer)
          if (decoded.exp < currentTime + 30 && !isRefreshing) {
            isRefreshing = true;
            console.log("Token expired or about to expire, refreshing...");
            
            try {
              // Get new token using refresh token (handled by cookies)
              const response = await AxiosInstance.get("/token");
              const newToken = response.data.accessToken;
              setAccessToken(newToken);
              
              // Use new token for current request
              config.headers.Authorization = `Bearer ${newToken}`;
              
              // Process queue with new token
              processQueue(null, newToken);
              isRefreshing = false;
            } catch (error) {
              if (!error.handledSilently) {
                console.log("Refresh token failed", error);
              }
              processQueue(error, null);
              isRefreshing = false;
              
              // Redirect to login page if refresh fails
              window.location.href = "/";
              return Promise.reject(error);
            }
          } else {
            // Token still valid or refresh in progress
            if (isRefreshing) {
              // Add request to queue if we're already refreshing
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              })
                .then(token => {
                  config.headers.Authorization = `Bearer ${token}`;
                  return config;
                })
                .catch(err => {
                  return Promise.reject(err);
                });
            } else {
              // Token still valid
              config.headers.Authorization = `Bearer ${accessToken}`;
            }
          }
        } catch (error) {
          console.log("Error decoding token", error);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
    { id: REQUEST_INTERCEPTOR_ID } // Add ID for tracking
  );

  // Response interceptor for handling 401/403 errors
  AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Skip handling for expected 401s on public routes
      if (error.config && 
          (error.config.url === "/token") && 
          error.response?.status === 401) {
        error.handledSilently = true;
        return Promise.reject(error);
      }
      
      // Check if error is 401 or 403, and request is not for refresh token
      const originalRequest = error.config;
      if ((error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry &&
          originalRequest.url !== "/token") {
        
        // Mark this request as retried
        originalRequest._retry = true;
        
        // Only try to refresh token if not already refreshing
        if (!isRefreshing) {
          isRefreshing = true;
          
          try {
            const response = await AxiosInstance.get("/token");
            const newToken = response.data.accessToken;
            setAccessToken(newToken);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // Process queue with new token
            processQueue(null, newToken);
            isRefreshing = false;
            
            return AxiosInstance(originalRequest);
          } catch (refreshError) {
            // If refresh token request itself fails with 401, it means we need to login again
            processQueue(refreshError, null);
            isRefreshing = false;
            
            // For auth errors, redirect to login page
            if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
              console.log("Session expired, redirecting to login");
              window.location.href = "/";
            }
            return Promise.reject(refreshError);
          }
        } else {
          // Add request to queue if we're already refreshing
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(AxiosInstance(originalRequest));
              },
              reject: (err) => {
                reject(err);
              }
            });
          });
        }
      }
      
      return Promise.reject(error);
    },
    { id: RESPONSE_INTERCEPTOR_ID } // Add ID for tracking
  );
};