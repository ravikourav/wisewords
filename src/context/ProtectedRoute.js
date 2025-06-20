import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import  { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const ProtectedRoute = ({ element }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
