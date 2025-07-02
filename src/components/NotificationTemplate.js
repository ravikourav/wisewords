import { useNavigate } from 'react-router-dom';
import timeAgo from '../utils/timeAgo.js';
import { notificationMessage } from '../utils/notificationMessages.js';
import { truncateText } from '../utils/truncate.js';

import RenderProfileImage from './RenderProfileImage.js';

function NotificationTemplate({data}) {
  const navigate = useNavigate();

  const handleCommentClick = (to) => {
    if(to === 'post'){
      navigate(`/post/${data.post._id}`);
    }
    else{
      navigate(`/user/${data.sender.username}`);
    }
  };

  const message = notificationMessage(data.type, data.type === 'like' ? data.data.context : null);

  return (
    <div className='notification-wrapper' >
      <div onClick={()=>{handleCommentClick('profile')}} >
        <RenderProfileImage source={data.sender.profile} className='notification-user-img' />
      </div>
      <div className='notification-info' onClick={()=>{handleCommentClick(data.type === 'follow' ? 'profile' : 'post')}}>
        <p className='notification-msg-content' >

          {/* Message sender username */}
          <span className='notification-username' >
            {data.sender.username}
          </span> 
          
          {/* Type of message */}
          <span className='notification-msg' >
            {message}
          </span>
          
          {/* Main message text */}
          {(data.type !== 'follow' ? ' ' + truncateText(data.data.comment, 5) : '')}
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