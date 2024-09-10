import React, { useEffect, useState } from 'react';
import './css/SimpleCard.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import Card from './Card.js';
import timeAgo from '../utils/timeAgo.js'
import IconButton from './IconButton.js';
import Dropdown from './Dropdown.js';

//icons 
import { ReactComponent as LikeIcon } from '../assets/icon/like.svg';
import { ReactComponent as ProfileIcon } from '../assets/icon/profile.svg';
import { ReactComponent as BookmarkIcon } from '../assets/icon/bookmark.svg';

function SimpleCard({card , isLoggedIn , cardClick , savedCard, saveClick , likes , profileClick , currentUser}) {
    const [savedCardId, setSavedCardId] = useState([]);
    const [saved , setSaved] = useState(false);
    const [liked , setLiked] = useState(false);
  
    useEffect(() => {
        // Set savedCard to user.saved only if the user is logged in
        if (isLoggedIn) {
          setSavedCardId(savedCard.map((savedPost) => savedPost._id));
        }
      }, [ savedCard , isLoggedIn])

    useEffect(() => {
        if( isLoggedIn){
            setSaved(savedCardId.includes(card._id));
            setLiked(likes.includes(currentUser));   
        }
    }, [ savedCardId , isLoggedIn ,likes, card._id,currentUser]);

    const handleLike = async () => {
        const token = Cookies.get('authToken');
        const endpoint = liked
          ? `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${card._id}/unlike`
          : `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${card._id}/like`;
    
        try {
          const response = await axios.post(endpoint, {}, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    
          if (response.status === 200) {
            setLiked(!liked);
            console.log(liked ? 'Post unliked successfully' : 'Post liked successfully');
          }
        } catch (error) {
          console.error('Error liking/unliking post:', error);
        }
      };

    return (
    <div>
        <Card
            margin={true}
            content={card.content}
            textColor={card.contentColor}
            author={card.author}
            authorColor={card.authorColor}
            background={card.backgroundImage}
            onClick={() => cardClick(card._id)}
        />
        <div className='simple-card-info-container'>
            <div className='simple-card-user-wraper' onClick={()=>profileClick(card.owner_id.username)}>
                { card.owner_id.avatar ?
                    <img src={card.owner_id.avatar} alt='' className='simple-card-profile-picture' />
                :
                    <ProfileIcon fill='#ccc' className='simple-card-profile-picture' />
                }
                <div onClick={()=>profileClick(card.owner_id.username)}>
                    <p className='simple-card-text'>{card.owner_id.name}</p>
                    <p className='simple-card-text'>{timeAgo(card.createdAt)}</p>
                </div>
            </div>
            <div className='simple-card-icon'>
                <div onClick={isLoggedIn ? handleLike : null}>
                    <IconButton 
                        icon={LikeIcon}
                        fill={liked ? 'red' : 'white'}
                        stroke={liked ? 'red' : 'black'}
                        disabled={!isLoggedIn} 
                        strokeWidth='3'
                        size='25'
                    />
                </div>
                <div onClick={isLoggedIn ? () => setSaved(saveClick(card._id , saved)) : null }>
                    <IconButton disabled={!isLoggedIn} icon={BookmarkIcon} fill={saved ? 'black' : 'white'}  size='25'/>
                </div>
                <Dropdown options={[
                    { 
                      label : 'Report' ,
                      onClick : () => console.log('Reported')
                    }]
                } iconOrientation='vertical' showIcon={true} size='22'/>
            </div>
        </div>
    </div>
    )
}

export default SimpleCard