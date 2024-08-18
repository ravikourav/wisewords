import React, { useState , useRef, useEffect, useContext } from 'react';
import './css/DetailedCard.css';
import Card from '../components/Card.js';
import { formatNumber } from '../utils/formatNumbers.js';
import Button from '../components/Button.js';
import Loading from '../components/Loading.js';

import { ReactComponent as SendIcon } from '../assets/icon/send.svg';
import { ReactComponent as DropDownIcon } from '../assets/icon/dropdown.svg';
import { ReactComponent as LikeIcon } from '../assets/icon/like.svg';
import { ReactComponent as CopyIcon } from '../assets/icon/copy.svg';
import { ReactComponent as PlayIcon } from '../assets/icon/play.svg';
import { ReactComponent as PauseIcon } from '../assets/icon/pause.svg';

import TempImg from '../assets/icon/profile.png';
import Comment from '../components/Comment.js';
import BackButton from '../components/BackButton.js';
import axios from 'axios';
import { AuthContext } from '../hooks/AuthContext.js';

function DetailedCard({ selectedCard , onClose}) {
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [isOwner , setIsOwner] = useState(false);
  const [isFollowing , setIsFollowing] = useState(null);
  const [liked, setLiked] = useState(false);

  const { isLoggedIn, user } = useContext(AuthContext);

  const [copied, setCopied] = useState(false);
  const [hideComment , setHideComment] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const utteranceRef = useRef(null); // Ref to store the utterance instance

  const featchCardData = async() =>{
    setLoading(true);
    const endpoint = `api/post/${selectedCard._id}`;
    const response = await axios.get(endpoint);
    setCardData(response.data);
    if(isLoggedIn){
      await fetchFollowStatus(response.data);
    }else{
      setLoading(false);
    }
  }

  const fetchFollowStatus = async (data) => {
    const endpoint = `/api/user/${selectedCard.owner_id._id}/isfollowing`;
    if(user.user.id === selectedCard.owner_id._id){
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
    await handleLikeCheck(data);
  };

  const handleLikeCheck = async (data) => {
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
      ? `/api/user/${selectedCard.owner_id._id}/unfollow` 
      : `/api/user/${selectedCard.owner_id._id}/follow`;
  
    try {
      const response = isFollowing 
        ? await axios.post(endpoint, { withCredentials: true })
        : await axios.post(endpoint, { withCredentials: true });
      console.log(response);
      if (response.status === 200) {
        setIsFollowing(!isFollowing);
        cardData.owner_id.followers = response.data.followers;
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const handleLike = async() => {
    const endpoint = liked
      ? `/api/post/${selectedCard._id}/unlike` 
      : `/api/post/${selectedCard._id}/like`;
    try {
      const response = liked 
        ? await axios.post(endpoint, { withCredentials: true })
        : await axios.post(endpoint, { withCredentials: true });
      if (response.status === 200) {
        setLiked(!liked);
        cardData.likes = response.data.likes;
      }
    } catch (error) {
      console.error('Error likeing/unlikeing user:', error);
    }
  };

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
      handleTextToSpeech(`${selectedCard.author} said, "${selectedCard.content}"`);
    }
  };

  const handleCopy = () => {
    const textToCopy = `${selectedCard.author} said, "${selectedCard.content}"`;

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

  return (
    <div className="modal-wraper">
      {loading ? 
      <Loading /> 
      : 
      <>
        <BackButton onClick={onClose}/>
        
        <div className='content-wraper'>
          <Card
            margin={false}
            content={selectedCard.content}
            textColor={selectedCard.contentColor}
            author={selectedCard.author}
            authorColor={selectedCard.authorColor}
            background={selectedCard.backgroundImage}
            tint={selectedCard.tintColor}
          />
          <div className="modal-box">
            <div className='post-owner-container'>
              <div className='flex-row'>
                <img className='post-owner-profile-image' src={TempImg} alt=''/>
                <div className='flex-column'>
                  <p className='post-owner-name'>{selectedCard.owner_id.username}</p>
                  <p className='post-owner-followers'>{formatNumber(cardData.owner_id.followers.length)} followers</p>
                </div>
              </div>
              {!isOwner && <Button onClick={followUnfollowOwner} disabled={!isLoggedIn} text={isFollowing ? 'Following' : 'Follow'} selected={isFollowing ? true : false}/>}
            </div>
            <div className='comment-container'>
              <div className='flex-row commnet-title-container' onClick={()=>{setHideComment(!hideComment)}}>
                <p className='comment-header'>Comments</p>
                <DropDownIcon className='icon'>V</DropDownIcon>
              </div>
              <div style={{marginBottom: '10px'}}>
                {hideComment && selectedCard.comments.map((comment)=>(
                  <Comment data={comment}/>
                ))}
              </div>
            </div>
            <div className='add-comment-container'>
              <img className='user-profile-image' src={TempImg} alt=''></img>
              <input className='main-input comment-input' placeholder='Comment' type='text' />
              <SendIcon className={`send-comment ${isLoggedIn ? '' : 'send-comment-disabled'}`} />
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
  );
}

export default DetailedCard;
