import './css/Notification.css';
import Loading from '../components/Loading.js';
import { useNotification } from '../context/NotificationContext.js';
import NotificationTemplate from '../components/NotificationTemplate.js';
import { useEffect } from 'react';

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
          <div className='empty-state-container'>
            <p className='empty-state-message'>All is calm — no new words for now.</p>
          </div>
      }
    </div>
  );
}

export default NotificationModel;
