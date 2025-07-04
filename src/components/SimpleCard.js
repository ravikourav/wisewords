import React, { useEffect, useCallback, useState } from 'react';
import './css/SimpleCard.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import Card from './Card.js';
import timeAgo from '../utils/timeAgo.js'
import IconButton from './IconButton.js';
import Dropdown from './Dropdown.js';
import Badge from './Badge.js';
import { truncateTextByChars } from '../utils/truncate.js';
import { useReport } from '../context/ReportContext.js';

//icons 
import { ReactComponent as LikeIcon } from '../assets/icon/like.svg';
import { ReactComponent as BookmarkIcon } from '../assets/icon/bookmark.svg';
import RenderProfileImage from './RenderProfileImage.js';

function SimpleCard({card , isLoggedIn , cardClick , savedCard, saveClick , likes , profileClick , currentUser , showHeader = true , showFooter = true}) {

  const { openReport } = useReport();

  const [saving, setSaving] = useState(false);
  const [saved , setSaved] = useState(false);
  const [liked , setLiked] = useState(false);

  const [cardSize, setCardSize] = useState('small');
  const [cardContent, setCardContent] = useState('');

  useEffect(()=>{
    const getCardSizeAndContent = () => {
      const contentLength = card.content.length;
    
      if (contentLength > 300) {
        return {
          size: 'large',
          content: truncateTextByChars(card.content, 300)
        };
      } else if (contentLength > 250) {
        return { 
          size: 'large', 
          content: card.content 
        };
      } else if (contentLength > 160) {
        return { 
          size: 'medium', 
          content: card.content 
        };
      } else {
        return { 
          size: 'small', 
          content: card.content 
        };
      }
    };

    const { size, content } = getCardSizeAndContent();
      setCardSize(size); // Update size state
      setCardContent(content); // Update content state
  },[card.content])


  useEffect(() => {
    if (isLoggedIn && showFooter) {
      setSaved(savedCard.includes(card._id));  // Directly check if this card is saved
      setLiked(likes.includes(currentUser));   // Like logic stays the same
    }
  }, [savedCard, isLoggedIn, showFooter, card._id, likes, currentUser]);

  const handleLike = async () => {
    const token = Cookies.get('authToken');
    const prevLiked = liked;
    setLiked(!liked); // Instant feedback

    const endpoint = prevLiked
      ? `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${card._id}/unlike`
      : `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${card._id}/like`;

    try {
      const response = await axios.post(endpoint, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status !== 200) {
        setLiked(prevLiked); // Rollback if failed
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      setLiked(prevLiked); // Rollback if error
    }
  };

  const handleSaveClick = async () => {
    if (!saveClick || saving) return;

    setSaving(true);
    const newSaved = !saved;
    setSaved(newSaved);

    const updated = await saveClick(card._id, !newSaved);
    setSaved(updated);
    setSaving(false);
  };

  return (
  <div className='simple-card-container'>
    {showHeader &&
      <div className='simple-card-header'>
        <div className='simple-card-user-container' onClick={()=>profileClick(card.owner_id.username)}>
          <RenderProfileImage source={card.owner_id.profile} className='simple-card-profile-picture' />
          <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            <p className='simple-card-username'>{card.owner_id.name} <Badge badge={card.owner_id.badge} size={13}/></p>
            <p className='simple-card-time'>{timeAgo(card.createdAt)}</p>
          </div>
        </div>

        <Dropdown 
          report={true} 
          disabled={!isLoggedIn}
          options={[
            { label : 'Report' , onClick : ()=>{openReport('post', card._id)} }
          ]} 
          iconOrientation='vertical' 
          menuPosition='bottom-right' 
          showIcon={true} size='22' 
          paddingNone={true}
        />
        
      </div>
    }

    <Card
      margin={true}
      content={cardContent}
      textColor={card.contentColor}
      author={card.author}
      authorColor={card.authorColor}
      background={card.backgroundImage}
      sampleSize={cardSize}
      onClick={() => cardClick(card._id)}
    />
    {showFooter && 
      <div className='simple-card-footer'>
          
          <p className='simple-card-title'>{card.title}</p>

          <div className='simple-card-icon'>
            <div onClick={isLoggedIn ? handleLike : null}>
                <IconButton 
                  icon={LikeIcon}
                  fill={liked ? 'red' : 'white'}
                  stroke={liked ? 'red' : 'black'}
                  disabled={!isLoggedIn} 
                  strokeWidth='1.5'
                  size='25'
                />
            </div>
            <div onClick={isLoggedIn ? handleSaveClick : null }>
              <IconButton disabled={!isLoggedIn} icon={BookmarkIcon} fill={saved ? 'black' : 'white'}  size='25'/>
            </div>
          </div>
      </div>
    }
  </div>
  )
}

export default SimpleCard