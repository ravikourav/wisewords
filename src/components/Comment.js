import React, { useContext, useEffect, useState } from 'react';
import './css/Comment.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import timeAgo from '../utils/timeAgo';
import { AuthContext } from '../hooks/AuthContext';
import Dropdown from '../components/Dropdown.js';

//icons
import { ReactComponent as LikedIcon } from '../assets/icon/like.svg';
import Badge from './Badge.js';
import RenderProfileImage from './RenderProfileImage.js';

function Comment({data , userId , postId , postOwnerId , deleteComment , deleteReply , reply}) {
  const { isLoggedIn } = useContext(AuthContext);
  const [likes, setLikes] = useState(data.likes.length || 0);
  const [liked, setLiked] = useState(false);

  const [viewReply , setViewReply] = useState(true);

  const [replyLikes, setReplyLikes] = useState(
    data.replies.map(reply => ({ id: reply.id, likes: reply?.likes.length || 0, liked: reply.likes.includes(userId) }))
  );

  useEffect(() => {
    // Initialize the liked state based on the user's like status
    setLiked(data.likes.includes(userId));

    // Initialize replyLikes state
    const initialReplyLikes = data.replies.map(reply => ({
      id: reply._id,
      likes: reply.likes.length,
      liked: reply.likes.includes(userId),
    }));
    setReplyLikes(initialReplyLikes);
  }, [data, userId]);


  const handleLike = async () => {
    const token = Cookies.get('authToken');
    const endpoint = liked
      ? `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${postId}/comment/${data._id}/unlike` 
      : `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${postId}/comment/${data._id}/like`;
    try {
      const response = await axios.post(endpoint, {},{ headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }  });
      if (response.status === 200 && response.data.likes) {
        console.log('like res : ',response.data);
        setLikes(liked ? likes - 1 : likes + 1);
        if(data){
          data.likes = response.data.likes;
        }
        setLiked(!liked);
        console.log(liked ? 'comment unliked succesfully' : 'comment liked succesfully');
      }
    } catch (error) {
      console.error('Error liking/unliking user:', error);
    }
  };

  const handelDropdownOptions = (item_author_id , isReply = false , replyId = null ) => {
    if(userId === postOwnerId){
      return [ 
        { 
          label : 'Report' ,
          onClick : () => console.log('Reported')
        },
        { 
          label : 'Block' ,
          onClick : () => console.log('Blocked')
        },
        { 
          label : 'Delete' ,
          onClick : () => isReply ? deleteReply(data._id , replyId) : deleteComment(data._id)
        },
      ]
    }
    else if(userId === item_author_id){
      return [
        { 
          label : 'Delete' ,
          onClick : () => isReply ? deleteReply( data._id , replyId) : deleteComment(data._id)
        },
      ]
    }
    else {
      return [ 
        { 
          label : 'Report' ,
          onClick : () => console.log('Reported')
        },
        { 
          label : 'Block' ,
          onClick : () => console.log('Blocked')
        }
      ]
    }
  }

  const handleReplyLike = async (replyId, index) => {
    const token = Cookies.get('authToken');
    const replyLiked = replyLikes[index].liked;
    const endpoint = replyLiked
      ? `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${postId}/comment/${data._id}/reply/${replyId}/unlike`
      : `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${postId}/comment/${data._id}/reply/${replyId}/like`;
    try {
      const response = await axios.post(endpoint,{}, { headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      } });
      if (response.status === 200 && response.data.likes) {
        setReplyLikes((prevLikes) =>
          prevLikes.map((replyLike, i) =>
            i === index
              ? { ...replyLike, likes: replyLiked ? replyLike.likes - 1 : replyLike.likes + 1, liked: !replyLiked }
              : replyLike
          )
        );
        data.replies[index].likes = response.data.likes;
        console.log(liked ? 'reply unliked succesfully' : 'reply liked succesfully');
      }
    } catch (error) {
      console.error('Error liking/unliking reply:', error);
    }
  };

  const handleReply = (id , name) => {
    reply(id , name);
  }
  
  const renderContent = (content) => {
    const parts = content.split(/(\s*@\w+)/g); // Split content by usernames

    return parts.map((part, index) => (
      part.startsWith('@') ? <span key={index} className="username">{part}</span> : part
    ));
  };

  return (
    <div className='comment-warper'>
      <div className='main-comment'>
        <RenderProfileImage src={data.comment_author.profile} className='comment-profile-picture' />
        <div className='comment-body'>
          <div className='row'>
            <p className='comment-name'>{data.comment_author.name} <Badge badge={data.comment_author.badge} size={12}/></p>
            <p className='comment-time'>{timeAgo(data.date)}</p>
          </div>
          <p className='comment-content'>{renderContent(data.comment)}</p>
          <div className='row'>
            <p className='reply-button' onClick={() => handleReply(data._id , data.comment_author.username)}>Reply</p>
            <Dropdown menuPosition='right' showIcon={true} options={handelDropdownOptions(data.comment_author._id)} iconColor='#767676'  size='20px'/>
          </div>
        </div>
        <div className='like-container' onClick={isLoggedIn ? handleLike : null}>
          <LikedIcon fill={liked ? 'red' : 'white'} stroke={liked ? 'red' : 'gray'} className='like-comment-icon' />
          <p className='commnet-like-count'>{likes}</p>
        </div>
      </div>

      {data.replies.length > 0 && viewReply && (
        <p className='view-reply-button' onClick={() => setViewReply(false)}>View {data.replies.length} more replies</p>
      )}
      
      {!viewReply && data.replies.map((reply, index) => (
        <div className='reply-container' key={reply._id}>
          <RenderProfileImage source={reply.reply_author.profile} className='reply-profile-picture' />
          <div className='comment-reply-body'>
            <div className='row'>
              <p className='comment-name'>{reply.reply_author.name}</p>
              <p className='comment-time'>{timeAgo(reply.date)}</p>
            </div>
            <p className='comment-content'>{renderContent(reply.reply)}</p>
            <div className='row'>
              <p className='reply-button' onClick={() => handleReply(data._id , reply.reply_author.username)}>Reply</p>
            <Dropdown menuPosition='right' showIcon={true} options={handelDropdownOptions(reply.reply_author._id , true , reply._id)} iconColor='#767676'  size='20px'/>
          </div>
          </div>
          <div className='like-container' onClick={isLoggedIn? () => handleReplyLike(reply._id , index): null}>
            <LikedIcon fill={replyLikes[index].liked ? 'red' : 'white'} stroke={replyLikes[index].liked ? 'red' : 'gray'} className='like-comment-icon' />
            <p className='commnet-like-count'>{replyLikes[index].likes}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Comment;
