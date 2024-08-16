import React, { useState } from 'react';
import NotificationTemplate from './NotificationTemplate.js';
import './css/Notification.css';

function NotificationModel() {
  
  const [notificationData , setNotificationData] = useState();

  return (
    <div className='notification-modle'>
        <div className='notification-header'>
            <p className='notification-title'>Updates</p>
        </div>
        <div className='notification-body'>
            {notificationData?.map((data)=>(
              <NotificationTemplate data={data} />
            ))}
        </div>
    </div>
  )
}

export default NotificationModel;