import React,{ useEffect, useContext ,useState } from 'react';
import './css/CardGrid.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Masonry } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { getCurrentSize } from '../utils/resposiveSize.js';
import  { useAuth } from '../context/AuthContext';

import SimpleCard from './SimpleCard.js';

const CardGrid = ({ data }) => {
  const { isLoggedIn , user, setUser } = useAuth();
  const navigate = useNavigate();
  const [numOfColumns , setNumOfColumns] = useState(1);

  const handleCardClick = (id) => {
    navigate(`/post/${id}`);
  };

  const handleProfileClick = (username) => {
    navigate(`/user/${username}`);
  };

  const handleSave = async (postId , isSaved) => {
    const token = Cookies.get('authToken');
    const action = isSaved ? 'unsave' : 'save';
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${postId}/${action}`;
    try {
      const response = await axios.put(endpoint, {} , { headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }  });
      if (response.status === 200) {
        const updatedSaved = isSaved 
          ? user.saved.filter(id => id !== postId) 
          : [...user.saved, postId];

        // Update the user's saved array in the context
        setUser({ ...user, saved: updatedSaved });
        return !isSaved;
      }
    } catch (error) {
      console.error('Error Saving Post:', error);
    }
  };

  const breakpoint = {
    xl: 4,
    lg: 3,
    md: 3,
    sm: 2,
    xs: 2,
    xxs: 1,
  };

  const spacing = {
    sm: 2,
    xs: 1,
  };

  useEffect(() => {
    const handleResize = () => {
      const newSize = getCurrentSize();
      const columns = breakpoint[newSize] || 1;
      setNumOfColumns(columns);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='card-layout'>
        {data.length > 0 ? (
          <Masonry columns={numOfColumns} spacing={spacing}>
            {data.map((card) => (
              <SimpleCard 
                key={card._id} 
                card={card} 
                isLoggedIn={isLoggedIn}
                savedCard={isLoggedIn ? user.saved  : null}
                likes={card.likes}
                saveClick={isLoggedIn ? handleSave : null}
                cardClick={handleCardClick} 
                profileClick={handleProfileClick}
                currentUser={isLoggedIn ? user._id :  null}
              />
            ))}
          </Masonry>
        ) : (
          <div className='empty-state-container'>
            <p className='empty-state-message'>The deck is empty, awaiting new stories.</p>
          </div>
        )}
    </div>
  );
};

export default CardGrid;
