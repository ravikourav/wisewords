import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(true); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture , setProfilePicture] = useState();

  // Function to handle authentication
  const authenticate = async () => {
    setLoading(true);
    const token = Cookies.get('authToken'); 

    if (token) {
      try {
        if (isTokenExpired(token)) {
          console.warn('Token expired');
          Cookies.remove('authToken');
          setIsLoggedIn(false);
          setUser(null);
        } else {
          const decodedUser = jwtDecode(token);
          console.log('Decoded user:', decodedUser);
          setIsLoggedIn(true);
          setUser(decodedUser);
          fetchProfilePicture(decodedUser.user.username);
        }
      } catch (error) {
        console.error('Invalid token:', error.message);
        Cookies.remove('authToken');
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    authenticate();
  }, []);

  const fetchProfilePicture = async (username) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/user/${username}/getProfilePicture`);
      if (response.status === 200) {
        setProfilePicture(response.data.profilePicture);
      }
    } catch (error) {
      console.error('Error fetching profile picture', error);
    }
  };

  const login = (token) => {
    Cookies.set('authToken', token); // Use localStorage
    try {
      const decodedUser = jwtDecode(token);
      setIsLoggedIn(true);
      setUser(decodedUser);
      fetchProfilePicture(decodedUser.user.username);
    } catch (error) {
      console.error('Invalid token:', error.message);
      logout(); // Clear authentication state on invalid token
    }
  };

  const logout = () => {
    console.log('Logged out');
    Cookies.remove('authToken'); // Use localStorage
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, login, logout,profilePicture}}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to check if the token is expired
const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return true; // Consider token expired if there's an issue decoding
  }
};

export default AuthProvider;
