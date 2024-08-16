import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../hooks/AuthContext';
import Loading from '../components/Loading';

const ProtectedRoute = ({ element }) => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loading />;
  }

  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
