import React, { useState } from 'react';
import userImg from '../assets/icon/profile.png';
import './css/Comment.css';
import timeAgo from '../utils/timeAgo';
import { ReactComponent as LikedIcon } from '../assets/icon/like.svg';

function Comment(props) {


  const [likes, setLikes] = useState(props.data.likes || 0);
  const [liked, setLiked] = useState(false);

  const [viewReply , setViewReply] = useState(false);

  const [replyLikes, setReplyLikes] = useState(
    props.data.replies.map(reply => ({ id: reply.id, likes: reply.likes || 0, liked: false }))
  );

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  const handleReplyLike = (id) => {
    setReplyLikes(replyLikes.map(replyLike => {
      if (replyLike.id === id) {
        if (replyLike.liked) {
          return { ...replyLike, likes: replyLike.likes - 1, liked: false };
        } else {
          return { ...replyLike, likes: replyLike.likes + 1, liked: true };
        }
      }
      return replyLike;
    }));
  };

  return (
    <div className='comment-warper'>
      <div className='main-comment'>
        <img className='comment-profile-picture' src={userImg} alt='' />
        <div className='comment-body'>
          <div className='row'>
            <p className='comment-username'>{props.data.username}</p>
            <p className='comment-time'>{timeAgo(props.data.date)}</p>
          </div>
          <p className='comment-content'>{props.data.comment}</p>
          <p className='reply-button'>Reply</p>
        </div>
        <div className='like-container' onClick={handleLike}>
          <LikedIcon fill={liked ? 'red' : 'white'} stroke={liked ? 'red' : 'gray'} className='like-comment-icon' />
          <p className='commnet-like-cont'>{likes}</p>
        </div>
      </div>

      { !viewReply ? (
        <p className='view-reply-button' onClick={()=>{setViewReply(true)}} >View {props.data.replies.length} more replies</p>
      ):(
        <>
          {props.data.replies.map((reply, index) => (
            <div className='reply-container' key={reply.id}>
              <img className='reply-profile-picture' src={userImg} alt='' />
              <div className='comment-reply-body'>
                <div className='row'>
                  <p className='comment-username'>{reply.username}</p>
                  <p className='comment-time'>{timeAgo(reply.date)}</p>
                </div>
                <p className='comment-content'>{reply.reply}</p>
                <p className='reply-button'>Reply</p>
              </div>
              <div className='like-container' onClick={() => handleReplyLike(reply.id)}>
                <LikedIcon fill={replyLikes[index].liked ? 'red' : 'white'} stroke={replyLikes[index].liked ? 'red' : 'gray'} className='like-comment-icon' />
                <p className='commnet-like-cont'>{replyLikes[index].likes}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Comment;
