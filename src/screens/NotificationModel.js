import React, { useEffect, useState } from 'react';
import NotificationTemplate from '../components/NotificationTemplate.js';
import './css/Notification.css';
import axios from 'axios';
import Cookies from 'js-cookie';

function NotificationModel() {
  
  const [notificationData, setNotificationData] = useState([]);

  const fetchNotification = async () => {
    const token = Cookies.get('authToken');
    try {
      const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/notifications`;
      const response = await axios.get(endpoint ,{headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }  } );
      if (response.status === 200) {
        setNotificationData(response.data);
      }
    } catch (error) {
      console.error('Error fetching Notification', error);
    }
  };

  const markAsRead = async(id) =>{
    const token = Cookies.get('authToken');
    try {
      const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/notifications/${id}/read`;
      const response = await axios.post(endpoint, {} ,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      } );
      if (response.status === 200) {
        console.log('marked as read : ' ,response.data);
      }
    } catch (error) {
      console.error('Error fetching Notification', error);
    }
  }

  useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <div className='notification-model'>
      <div className='notification-header'>
          <p className='notification-title'>Updates</p>
      </div>
      <div className='notification-body'>
          {notificationData?.map((data) => (
            <NotificationTemplate key={data._id} data={data} markRead={markAsRead} />
          ))}
      </div>
    </div>
  );
}

export default NotificationModel;
