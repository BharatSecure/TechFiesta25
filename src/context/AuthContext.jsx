import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    console.log(isLoggedIn)
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = () => {
    // Logic to handle user login (e.g., API call, token storage)
    localStorage.setItem("token", "your_token_here");
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Logic to handle user logout (e.g., clear token)
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
