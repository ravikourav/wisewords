import React, { useState , useRef, useEffect, useContext } from 'react';
import './css/DetailedCard.css';
import Card from '../components/Card.js';
import { formatNumber } from '../utils/formatNumbers.js';
import Button from '../components/Button.js';
import Loading from '../components/Loading.js';
import { useMediaQuery } from 'react-responsive';
import { Link, useParams , useNavigate } from 'react-router-dom';

import Comment from '../components/Comment.js';
import BackButton from '../components/BackButton.js';
import axios from 'axios';
import { AuthContext } from '../hooks/AuthContext.js';
import IconButton from '../components/IconButton.js';

import { calculateAspectRatio } from '../utils/calculateDimensions.js';

//icons
import { ReactComponent as SendIcon } from '../assets/icon/send.svg';
import { ReactComponent as DropDownIcon } from '../assets/icon/dropdown.svg';
import { ReactComponent as LikeIcon } from '../assets/icon/like.svg';
import { ReactComponent as CopyIcon } from '../assets/icon/copy.svg';
import { ReactComponent as PlayIcon } from '../assets/icon/play.svg';
import { ReactComponent as PauseIcon } from '../assets/icon/pause.svg';
import { ReactComponent as CloseIcon } from '../assets/icon/close.svg';
import { ReactComponent as ProfileIcon } from '../assets/icon/profile.svg';

function DetailedCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user, profilePicture} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [isOwner , setIsOwner] = useState(false);
  const [isFollowing , setIsFollowing] = useState(null);
  const [liked, setLiked] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [cardWidth , setCardWidth] = useState('');
  const [cardHeight , setCardHeight] = useState('');
  const [aspectRatio, setAspectRatio] = useState('');

  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyWithUsername , setReplyWithUsername] = useState(null);
  const [hideComments , setHideComments] = useState(true);

  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const utteranceRef = useRef(null);


  const featchCardData = async() =>{
    setLoading(true);
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${id}`;
    const response = await axios.get(endpoint);
    setCardData(response.data);
    console.log('card data : ',response.data)
    if(isLoggedIn){
      await followStatus(response.data);
    }else{
      setLoading(false);
    }
  }

  const followStatus = async (data) => {
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${data.owner_id._id}/isfollowing`;
    if(user.user.id === data.owner_id._id){
      setIsOwner(true);
    }
    else{
      setIsOwner(false);
      try {
        const response = await axios.get(endpoint , {
          withCredentials: true,
        });
        setIsFollowing(response.data.isfollowing);
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    }
    await likeStatus(data);
    dimension(data);
  };

  const dimension = (data) => {
    const ratio = calculateAspectRatio(data.width , data.height);
    const [aspectWidth, aspectHeight] = ratio.split(':').map(Number);
    if (aspectWidth > aspectHeight) {
      const newWidth = Math.min(window.innerWidth * 0.56, data.width);
      const newHeight = newWidth / (aspectWidth / aspectHeight);
      setCardWidth(newWidth + 'px');
      setCardHeight(newHeight + 'px');
    } else {
      const newHeight = Math.min(window.innerHeight * 0.78, data.height);
      const newWidth = newHeight * (aspectWidth / aspectHeight);
      setCardWidth(newWidth + 'px');
      setCardHeight(newHeight + 'px');
    }
  };
  
  useEffect(() => {
    const handleResize = () => {
        if (cardData) {
            dimension(cardData);
        }
    };

    window.addEventListener('resize', handleResize);

    // Call the function initially to set dimensions
    if (cardData) {
        dimension(cardData);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
}, [cardData]);

  const likeStatus = async (data) => {
    if(data.likes.includes(user.user.id)){
      setLiked(true);
    }
    else{
      setLiked(false);
    }
    setLoading(false);
  }

  useEffect(() => {
    featchCardData();
  }, [isLoggedIn]);

  const followUnfollowOwner = async () => {
    const endpoint = isFollowing 
      ? `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${cardData.owner_id._id}/unfollow` 
      : `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${cardData.owner_id._id}/follow`;
  
    try {
      const response = await axios.post(endpoint,{}, { withCredentials: true });
      if (response.status === 200) {
        setIsFollowing(!isFollowing);
        cardData.owner_id.followers = response.data.followers;
        console.log(isFollowing ? 'user unfollowed succesfully' : 'user followed succesfully');
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const handleLike = async() => {
    const endpoint = liked
      ? `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${id}/unlike` 
      : `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${id}/like`;
    try {
      const response = await axios.post(endpoint, {},{ withCredentials: true });
      if (response.status === 200) {
        setLiked(!liked);
        cardData.likes = response.data.likes;
        console.log(liked ? 'post unliked succesfully' : 'post liked succesfully');
      }
    } catch (error) {
      console.error('Error liking/unliking user:', error);
    }
  };

  const addComment = async() => {
    const endpoint = replyingTo ? 
      `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${cardData._id}/comment/${replyingTo}/reply`:
      `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${cardData._id}/comment` ;
    try {
      const response = await axios.post(
        endpoint,
        { comment },
        { withCredentials: true }
      );
      setComment('');
      setReplyingTo(null);
      console.log(response);
    }catch(err) {
      console.error('Error Adding Commnet/Reply user:', err);
    }
  }

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

  const handleTextToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      if (!isPlaying) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === 'en-US');
        utterance.onend = () => setIsPlaying(false); // Reset playing state when speech ends
        speechSynthesis.speak(utterance);
        utteranceRef.current = utterance; // Store the utterance instance
        setIsPlaying(true);
      } else {
        speechSynthesis.pause();
        setIsPlaying(false);
      }
    } else {
      alert('Sorry, your browser does not support text to speech.');
    }
  };

  const handleResume = () => {
    if ('speechSynthesis' in window && speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const handleSpeak = () => {
    if (isPlaying) {
      speechSynthesis.pause();
      setIsPlaying(false);
    } else if (speechSynthesis.paused) {
      handleResume();
    } else {
      handleTextToSpeech(`${cardData.author} said, "${cardData.content}"`);
    }
  };

  const handleCopy = () => {
    const textToCopy = `${cardData.author} said, "${cardData.content}"`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        fallbackCopyTextToClipboard(textToCopy);
      });
    } else {
      fallbackCopyTextToClipboard(textToCopy);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  };

  const handleClose = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className='detailed-page-layout'>
      <div className='card-layout'>
        <div className="modal-wraper">
          {loading ? 
          <Loading /> 
          : 
          <>
            <BackButton onClick={handleClose}/>
            
            <div className='content-wraper'>
              <Card
                sizeCustom={true}
                width={isMobile ? '' : cardWidth}
                margin={false}
                content={cardData.content}
                textColor={cardData.contentColor}
                author={cardData.author}
                authorColor={cardData.authorColor}
                background={cardData.backgroundImage}
                tint={cardData.tintColor}
              />
              <div style={{height:cardHeight}} className="modal-box">
                <div className='post-owner-container'>
                  <div className='flex-row'>
                    <Link to={`/user/${cardData.owner_id.username}`} >
                      {cardData.owner_id.avatar ?
                        <img src={cardData.owner_id.avatar} alt='' className='post-owner-profile-image' />
                      :
                        <ProfileIcon fill='#ccc' className='post-owner-profile-image' />
                      }
                    </Link>
                    <div className='flex-column'>
                      <Link to={`/user/${cardData.owner_id.username}`} className="custom-link" >
                      <p className='post-owner-name'>{cardData.owner_id.username}</p>
                      </Link>
                      <p className='post-owner-followers'>{formatNumber(cardData.owner_id.followers.length)} followers</p>
                    </div>
                  </div>
                  {!isOwner && <Button onClick={followUnfollowOwner} disabled= {!isLoggedIn} text={isFollowing ? 'Following' : 'Follow'} selected={isFollowing ? true : false}/>}
                </div>
                <div className='comment-container'>
                  <div className='flex-row commnet-title-container'>
                    <p className='comment-header'>Comments</p>
                    <IconButton className={hideComments ? 'flip' : 'flipOut'} icon={DropDownIcon} onClick={()=>{setHideComments(!hideComments)}} />
                  </div>
                  <div className='commnet-section' style={{ marginBottom: '10px' }}>
                  {hideComments ? (
                    cardData.comments.length > 0 ? (
                      cardData.comments.map((comment) => (
                        <Comment key={comment._id} data={comment} userId={user.user.id} postId={id} reply={handleReplyingTo} replyTo />
                      ))
                    ) : (
                      <p className='message'>No echoes to share.</p>
                    )
                  ) : null}
                  </div>
                </div>
                { replyingTo &&
                  <div className='replyingTo-container'>
                    <p className='replyingTo-text'>Replying to {replyWithUsername}</p>
                    <IconButton className='replyingTo-close' icon={CloseIcon} size='25px' onClick={closeReplyingTo} >X</IconButton>
                  </div>
                }
                <div className='add-comment-container'>
                  {cardData.owner_id.avatar ?
                    <img src={profilePicture} alt='' className='user-profile-image' />
                  :
                    <ProfileIcon fill='#ccc' className='user-profile-image' />
                  }
                  <input className='main-input comment-input' placeholder='Comment' type='text' value={comment} onChange={(e)=>setComment(e.target.value)} />
                  <IconButton icon={SendIcon} disabled={isLoggedIn? false : true} size='35px' onClick={addComment}/>
                </div>
              </div>
            </div>
            <div className='post-controle'>
              <div className='control-wraper' onClick={handleSpeak} >
                {!isPlaying ? 
                <PlayIcon className='post-icon' /> : 
                <PauseIcon className='post-icon' />
                }
                <p className='controle-lable'>speak</p>
              </div>
              <div onClick={isLoggedIn ? handleLike : null} className={`control-wrapper ${isLoggedIn ? '' : 'control-wrapper-disabled'}`} >
                <LikeIcon 
                  fill={liked ? 'red' : 'white'}
                  stroke={isLoggedIn ? (liked ? 'red' : 'black') : 'darkgray'} strokeWidth='3' className='post-icon'/>
                <p className='controle-lable'>{formatNumber(cardData.likes.length)}</p>
              </div>
              <div className='control-wraper' onClick={handleCopy}>
                <CopyIcon className='post-icon' />
                <p className='controle-lable'>{!copied ? 'Copy' : 'Copied'}</p>
              </div>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

export default DetailedCard;
