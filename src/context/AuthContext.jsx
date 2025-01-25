import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email, password, rememberMe) => {
    // Basic login validation for the frontend
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", "mock_token_123");
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Clear token from both localStorage and sessionStorage
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // Log the login state when it changes
  useEffect(() => {
    console.log("Login State after Signup:", isLoggedIn);
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
