import React,{ useState, useEffect } from 'react'
import './css/CommentScection.css';
import Comment from './Comment';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import RenderProfileImage from './RenderProfileImage';
import IconButton from './IconButton';
import { ReactComponent as SendIcon } from '../assets/icon/send.svg';
import { ReactComponent as CloseIcon } from '../assets/icon/close.svg';

function CommentScection({postId, visibilty, onClose}) {
  const { user, isLoggedIn } = useAuth();
  const { showAlert } = useAlert();
  const [comment, setComment] = useState('');
  const [commentData, setCommentData] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyWithUsername , setReplyWithUsername] = useState(null);


  const featchCommnets = async () => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = Cookies.get('authToken');
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${postId}/getComments`;
        const response = await axios.get(endPoint, { headers });
        if (response.status === 200) {
            setCommentData(response.data);
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
        showAlert('Error fetching comments', 'error');
    }
  }

  useEffect(() => {
    featchCommnets();
    // eslint-disable-next-line
  }, [postId]);

  const addComment = async () => {
    const token = Cookies.get('authToken');
    const endpoint = replyingTo
      ? `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${postId}/comment/${replyingTo}/reply`
      : `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${postId}/comment`;

    try {
      const response = await axios.post(endpoint, { comment }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        if (replyingTo) {
          // Add reply manually
          setCommentData(prev =>
            prev.map(c =>
              c._id === replyingTo
                ? { ...c, replies: [...c.replies, response.data.reply] }
                : c
            )
          );
        } else {
          // Add comment manually
          setCommentData(prev => [
            { ...response.data.comment, replies: [] },
            ...prev
          ]);
        }
        setComment('');
        setReplyingTo(null);
        setReplyWithUsername(null);
      }
    } catch (err) {
      console.error('Error Adding Comment/Reply user:', err);
      showAlert(replyingTo ? `Error while Replying to ${replyingTo}` : 'Error Adding Comment', 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = Cookies.get('authToken');
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${postId}/comment/${commentId}`;

    try {
      const response = await axios.delete(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setCommentData(prev =>
          prev.filter(comment => comment._id !== commentId)
        );
      }
    } catch (err) {
      showAlert('Error deleting comment', 'error');
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    const token = Cookies.get('authToken');
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${postId}/comment/${commentId}/reply/${replyId}`;

    try {
      const response = await axios.delete(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setCommentData(prev =>
          prev.map(comment =>
            comment._id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.filter(reply => reply._id !== replyId)
                }
              : comment
          )
        );
      }
    } catch (error) {
      showAlert('Error deleting reply', 'error');
    }
  };

  const handleReplyingTo = (id , name) => {
    setReplyingTo(id);
    setReplyWithUsername(name);
    setComment(`@${name} `);
  }

  const closeReplyingTo = () => {
    setReplyingTo(null);
    setReplyWithUsername(null);
    setComment('');
  }


  return (
    !visibilty ? null :
    <div className="comment-section-root">
        <div className='comment-section-header'>
            <p className='comment-section-header-title'>Comments</p>
            <IconButton size={35} icon={CloseIcon} onClick={onClose} />
        </div>

        <div className='comment-section-body' style={{ marginBottom: '10px' }}>
            {commentData.length > 0 ? (
                <>
                    {commentData.map((comment) => (
                    <Comment key={comment._id} data={comment} deleteComment={handleDeleteComment} deleteReply={handleDeleteReply} userId={isLoggedIn ? user._id : null} postId={postId} postOwnerId={user._id} reply={handleReplyingTo} replyTo />
                    ))}
                    <p style={{fontSize:'2rem'}}>.</p>
                </>
                ) : (
                <div className='empty-state-container'>
                    <p className='empty-state-message'>No thoughts shared yet.</p>
                </div>
            )}
        </div>
        
        {replyingTo &&
        <div className='replying-to-container'>
            <p className='replying-to-text'>Replying to <span className='replying-to-username'>{replyWithUsername}</span></p>
            <IconButton className='replying-to-close' icon={CloseIcon} size='28px' onClick={closeReplyingTo} />
        </div>}
        <div className='add-comment-container'>
            <RenderProfileImage source={user?.profile} className='user-profile-image' />
            <input
                className='comment-input' placeholder='Comment' 
                type='text' 
                value={comment} 
                onChange={(e)=>setComment(e.target.value)} 
                onBlur={() => {if (comment === `@${replyWithUsername} `) closeReplyingTo();}}
            />
            <IconButton icon={SendIcon} disabled={isLoggedIn? false : true} size='35px' onClick={addComment}/>
        </div>
    </div>
  )
}

export default CommentScection