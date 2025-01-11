import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import RequestHandlerImpl  from "./services/RequestHandler.ts";
import LoginPage from "./screens/login/login_screen.tsx";
import RegisterPage from "./screens/registration/register_screen.tsx";


function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    const tryRefreshToken = async () => {
      const requestHandler = RequestHandlerImpl.getInstance();

      try {
        const response = await requestHandler.refreshToken();
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUserUid(requestHandler.getCredentials().userUid);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    tryRefreshToken();
  }, []);

  if (loading) {
    return (
      <div className="App flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-xl">Loading...</h1>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={`/home/${userUid}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                onLoginCompleted={(uid) => {
                  setUserUid(uid);
                  setIsAuthenticated(true);
                }}
                onNavigateToRegister={() => {
                  console.log("Navigate to registration screen");
                  // Handle navigation to a registration screen if needed
                  
                }}
              />
            }
          />
          <Route
            path="/register"
            element={
              <RegisterPage
                onRegistrationCompleted={(uid) => {
                  setUserUid(uid);
                  setIsAuthenticated(true);
                }}
                onNavigateToLogin={() => {
                  console.log("Navigate to registration screen");
                  // Handle navigation to a registration screen if needed
                 
                }}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
