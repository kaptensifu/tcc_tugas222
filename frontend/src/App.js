// 3. Fix App.js to properly set up interceptors only once
// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoteList from "./components/NoteList.js";
import AddNote from "./components/AddNote.js";
import EditNote from "./components/EditNote.js";
import Login from './components/Login';
import Register from "./components/Register.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import "bulma/css/bulma.css";
import { useAuth } from "./auth/AuthProvider.js";
import { useEffect, useRef } from "react";
import { setupInterceptors } from "./api/AxiosInterceptor.js";

function App() {
  const { accessToken, setAccessToken } = useAuth();
  const interceptorsSetup = useRef(false);
  
  // Setup axios interceptors only once
  useEffect(() => {
    if (accessToken && setAccessToken && !interceptorsSetup.current) {
      setupInterceptors(accessToken, setAccessToken);
      interceptorsSetup.current = true;
    }
  }, [accessToken, setAccessToken]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route 
          path="notes" 
          element={
            <ProtectedRoute>
              <NoteList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="add" 
          element={
            <ProtectedRoute>
              <AddNote />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="edit/:id" 
          element={
            <ProtectedRoute>
              <EditNote />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;