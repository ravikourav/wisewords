// src/index.js
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.js';
import Error from './screens/Error.js';
import Home from './screens/Home.js';
import Explore from './screens/Explore.js';
import Profile from './screens/Profile.js';
import Create from './screens/Create.js';
import Login from './screens/Login.js';
import AuthProvider from './hooks/AuthContext.js';
import ProtectedRoute from './hooks/ProtectedRoute.js';
import reportWebVitals from './reportWebVitals.js';
import DetailedCard from './screens/DetailedCard.js';
import ProfileSetting from './screens/ProfielSetting.js';
import Loading from './components/Loading.js';

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
      path: 'create',
      element: <ProtectedRoute element={<Create />} />
    },
    {
      path: 'login',
      element: <Login />
    },
    {
      path: 'user/:username',
      element: <Profile /> 
    },
    {
      path : 'editUser',
      element: <ProfileSetting />
    },
    {
      path: 'post/:id',
      element: <DetailedCard />
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
