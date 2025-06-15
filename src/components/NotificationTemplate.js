import { useNavigate } from 'react-router-dom';
import timeAgo from '../utils/timeAgo';
import { notificationMessage } from '../utils/notificationMessages';
import { truncateText } from '../utils/truncate';

import RenderProfileImage from './RenderProfileImage';

function NotificationTemplate({data , markRead}) {
  const navigate = useNavigate();

  const handleCommentClick = (to) => {
    if(to === 'post'){
      navigate(`/post/${data.post._id}`);
    }
    else{
      navigate(`/user/${data.sender.username}`);
    }
    markRead(data._id);
  };

  const message = notificationMessage(data.type, data.type === 'like' ? data.data.context : null);

  return (
    <div className='notification-wrapper' >
      <div onClick={()=>{handleCommentClick('profile')}} >
        <RenderProfileImage profile={data.sender.profile} className='notification-user-img' />
      </div>
      <div className='notification-info' onClick={()=>{handleCommentClick(data.type === 'follow' ? 'profile' : 'post')}}>
        <p className={data.read ? 'notification-msg-read' : 'notification-msg-unread'}>
          <span className={data.read ? 'notification-username-read' : 'notification-username'}>
            @{data.sender.username}
          </span> 
        {message + (data.type !== 'follow' ? ' : ' + truncateText(data.data.comment, 5) : '')}
        </p>
        <p className='notification-time'>{timeAgo(data.createdAt)}</p>
      </div>
      {data.type !== 'follow' ?
        <div onClick={()=>{handleCommentClick('post')}} >
          <img className='notification-post-img' src={data.post.backgroundImage} alt='' />
        </div> : null
      }
    </div>
  )
}

export default NotificationTemplate;