import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let logoutTimer;

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    if (storedToken) {
      setIsLoggedIn(true);
      resetTimer(); // Reset timer on login
    }
  }, []);

  const login = (email, password, rememberMe) => {
    // Basic login validation for the frontend
    const storage = rememberMe ? localStorage : sessionStorage;
    // storage.setItem("token", "mock_token_123");
    setIsLoggedIn(true);
    resetTimer(); // Start auto-logout timer on mount
  };

  const logout = () => {
    // Clear token from both localStorage and sessionStorage
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    clearTimeout(logoutTimer);
  };

  // Function to reset the auto-logout timer
  const resetTimer = () => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      logout();
      console.log("User logged out due to inactivity");
    }, 3600000); // 1 hour
  };

  // Detect user activity and reset the timer
  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(logoutTimer);
    };
  }, []);

  // Log the login state when it changes
  useEffect(() => {
    console.log("Login State:", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
