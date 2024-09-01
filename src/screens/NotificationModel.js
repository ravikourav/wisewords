import React, { useEffect, useState } from 'react';
import NotificationTemplate from '../components/NotificationTemplate.js';
import './css/Notification.css';
import axios from 'axios';

function NotificationModel() {
  
  const [notificationData , setNotificationData] = useState();

  const fetchNotificaiton = async () => {
    try {
      const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/notifications`;
      const response = await axios.get(endpoint ,{ withCredentials: true } );
      if (response.status === 200) {
        console.log(response.data);
        setNotificationData(response.data);
      }
    } catch (error) {
      console.error('Error fetching Notification', error);
    }
  };

  useEffect(()=>{
    fetchNotificaiton();
  },[])

  return (
    <div className='notification-modle'>
        <div className='notification-header'>
            <p className='notification-title'>Updates</p>
        </div>
        <div className='notification-body'>
            {notificationData?.map((data)=>(
              <NotificationTemplate key={data._id} data={data} />
            ))}
        </div>
    </div>
  )
}

export default NotificationModel;