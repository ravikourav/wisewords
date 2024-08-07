import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Ensure correct import

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Decode the token if it exists
        const decodedUser = jwtDecode(token);
        setIsLoggedIn(true);
        setUser(decodedUser);
      } catch (error) {
        console.error('Invalid token:', error.message);
        localStorage.removeItem('authToken'); // Clear invalid token
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      // No token found
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    try {
      const decodedUser = jwtDecode(token);
      setIsLoggedIn(true);
      setUser(decodedUser);
    } catch (error) {
      console.error('Invalid token:', error.message);
      logout(); // Clear authentication state on invalid token
    }
  };

  const logout = () => {
    console.log('loged out');
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUser(null);
    console.log(user);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
