import React from 'react';
import timeAgo from '../utils/timeAgo';

function NotificationTemplate(props) {
  return (
    <div className='notification-wraper' >
      <img className='notification-post-img' src='https://picsum.photos/id/101/200/300' alt='' />
      <p className='notification-content'>{props.data.message}</p>
      <p className='notification-time'>{timeAgo(props.data.createdAt)}</p>
    </div>
  )
}

export default NotificationTemplate;