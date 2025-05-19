// 2. Next, let's improve the AxiosInterceptor.js
// src/api/AxiosInterceptor.js
import AxiosInstance from "./AxiosInstance.js";
import { jwtDecode } from "jwt-decode";

// Menambahkan flag untuk mencegah infinite loop
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

// Bungkus dalam fungsi untuk bisa diimpor dan digunakan AuthProvider
export const setupInterceptors = (accessToken, setAccessToken) => {
  // Request interceptor
  AxiosInstance.interceptors.request.use(
    async (config) => {
      // Jangan mencoba refresh token untuk request refresh token atau login
      if (config.url === "/token" || config.url === "/login") {
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
              console.log("Refresh token failed", error);
              processQueue(error, null);
              isRefreshing = false;
              
              // Redirect to login page if refresh fails
              window.location.href = "/";
              return Promise.reject(error);
            }
          } else {
            // Token masih valid atau refresh sedang berlangsung
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
              // Token masih valid
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
    }
  );

  // Response interceptor untuk handling error 401/403
  AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Cek apakah error adalah 401 atau 403, dan request bukan untuk refresh token
      const originalRequest = error.config;
      if ((error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry &&
          originalRequest.url !== "/token") {
        
        // Tandai request ini sudah pernah retry
        originalRequest._retry = true;
        
        // Hanya mencoba refresh token jika belum dalam proses refresh
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
            console.log("Refresh token failed", refreshError);
            processQueue(refreshError, null);
            isRefreshing = false;
            
            // Redirect to login page
            window.location.href = "/";
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
    }
  );
};