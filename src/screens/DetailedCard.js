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

function DetailedCard({ selectedCard , onClose ,onUpdateCard}) {
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [isOwner , setIsOwner] = useState(false);
  const [likes, setLikes] = useState(selectedCard.likes.length);
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
      fetchFollowStatus();
    }
  }

  const fetchFollowStatus = async () => {
    const endpoint = `/api/user/${selectedCard.owner_id._id}/isfollowing`;
    if(user.user._id === selectedCard.owner_id.id){
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
    setLoading(false);
  };


  useEffect(() => {
    featchCardData();
  }, [isLoggedIn]);

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

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
    // Update the parent component with the new like count
    onUpdateCard({ ...selectedCard, likes: likes + (liked ? -1 : 1) });
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


  const followUnfollowOwner = async () => {
    const endpoint = isFollowing 
      ? `/api/user/${selectedCard.owner_id._id}/unfollow` 
      : `/api/user/${selectedCard.owner_id._id}/follow`;
  
    try {
      const response = isFollowing 
        ? await axios.delete(endpoint, { withCredentials: true })
        : await axios.post(endpoint, { withCredentials: true });
      console.log(response);
      if (response.status === 200) {
        setIsFollowing(!isFollowing);
        // Notify parent component of follow/unfollow changes
        onUpdateCard({ ...selectedCard, isFollowing: !isFollowing });
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
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
              <SendIcon className='send-comment' />
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
          <div onClick={handleLike} className='control-wraper' >
            <LikeIcon fill={liked ? 'red' : 'white'} stroke={liked ? 'red' : 'black'} strokeWidth='3' className='post-icon' />
            <p className='controle-lable'>{formatNumber(likes)}</p>
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
