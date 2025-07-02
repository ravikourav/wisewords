import { useEffect } from 'react';
import './css/Notification.css';
import Loading from './Loading.js';
import { useNotification } from '../context/NotificationContext.js';
import NotificationTemplate from './NotificationTemplate.js';

function NotificationModel() {
  const { notifications, loading, markAllAsRead } = useNotification();

  useEffect(()=>{
    markAllAsRead();
  },[markAllAsRead])

  return (
    <div className='notification-body'>
      {loading ? <Loading /> : 
        notifications.length > 0 ?
          notifications?.map((data) => (
            <NotificationTemplate key={data._id} data={data} />
          ))
          :
          <p className='empty-state-message'>All is calm — no new words for now.</p>
      }
    </div>
  );
}

export default NotificationModel;
