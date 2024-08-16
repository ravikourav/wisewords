// src/index.js
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import axios from 'axios';
import App from './App';
import Error from './screens/Error.js';
import Home from './screens/Home.js';
import Explore from './screens/Explore.js';
import Profile from './screens/Profile.js';
import Create from './screens/Create.js';
import Login from './screens/Login.js';
import AuthProvider from './hooks/AuthContext.js';
import ProtectedRoute from './hooks/ProtectedRoute.js';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  errorElement: <Error />,
  children: [
    {
      path: '',
      element: <Home />
    },
    {
      path: 'explore',
      element: <Explore />
    },
    {
      path: 'profile',
      element: <ProtectedRoute element={<Profile />} /> 
    },
    {
      path: 'create',
      element: <ProtectedRoute element={<Create />} />
    },
    {
      path: 'login',
      element: <Login />
    }
  ]
}]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
