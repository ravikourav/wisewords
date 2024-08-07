import React, { useState , useRef } from 'react';
import './css/DetailedCard.css';
import Card from './Card.js';
import { formatNumber } from '../utils/formatNumbers.js';

import { ReactComponent as BackIcon } from '../assets/icon/arrow-back.svg';
import { ReactComponent as SendIcon } from '../assets/icon/send.svg';
import { ReactComponent as DropDownIcon } from '../assets/icon/dropdown.svg';
import { ReactComponent as LikeIcon } from '../assets/icon/like.svg';
import { ReactComponent as ShareIcon } from '../assets/icon//share.svg';
import { ReactComponent as CopyIcon } from '../assets/icon/copy.svg';
import { ReactComponent as PlayIcon } from '../assets/icon/play.svg';
import { ReactComponent as PauseIcon } from '../assets/icon/pause.svg';

import TempImg from '../assets/icon/profile.png';
import Comment from './Comment.js';

function DetailedCard({ selectedCard , onClose }) {

  const [likes, setLikes] = useState(selectedCard.likes || 0);
  const [liked, setLiked] = useState(false);

  const [copied, setCopied] = useState(false);
  const [hideComment , setHideComment] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const utteranceRef = useRef(null); // Ref to store the utterance instance

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
      <BackIcon className='close' onClick={onClose} />
      
      <div className='content-wraper'>
        <Card 
          size='large'
          margin={false}
          content={selectedCard.content}
          textColor={selectedCard.contentColor}
          author={selectedCard.author}
          background={selectedCard.background}
        />
        <div className="modal-box">
          <div className='post-owner-container'>
            <div className='flex-row'>
              <img className='post-owner-profile-image' src={TempImg} alt=''/>
              <div className='flex-column'>
                <p className='post-owner-name'>RaviKourav</p>
                <p className='post-owner-followers'>200k followers</p>
              </div>
            </div>
            <p className='main-button'>Follow</p>
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
        {/*<div className='control-wraper' >
          <ShareIcon className='post-icon' />
          <p className='controle-lable'>Share</p>
        </div>*/}
      </div>
    </div>
  );
}

export default DetailedCard;
