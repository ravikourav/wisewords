import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = async () => {
    setLoading(true);
    const token = Cookies.get('authToken');
    try {
      const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/notifications`;
      const response = await axios.get(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setNotifications(response.data);
      }
    } catch (err) {
      console.error('Error fetching notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    const token = Cookies.get('authToken');
    try {
      const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/notifications/mark-all-read`;
      await axios.put(endpoint, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (err) {
      console.error('Error marking all as read', err);
    }
  };

  useEffect(() => {
    fetchNotifications(); // load once on mount
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, loading, unreadCount, refetch: fetchNotifications, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
