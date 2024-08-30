import React,{ useEffect, useState } from 'react';
import './css/CardGrid.css';
import Card from './Card.js';
import { Masonry } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { getCurrentSize } from '../utils/resposiveSize.js';

const CardGrid = ({ data }) => {
  const navigate = useNavigate();
  const [numOfColumns , setNumOfColumns] = useState(1);

  const handleCardClick = (card) => {
    navigate(`/post/${card._id}`);
  };

  const breakpoint = {
    xl: 6,
    lg: 5,
    md: 4,
    sm: 3,
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
              <Card
                key={card._id}
                margin={true}
                content={card.content}
                textColor={card.contentColor}
                author={card.author}
                authorColor={card.authorColor}
                background={card.backgroundImage}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </Masonry>
        ) : (
          <p>The deck is empty, awaiting new stories.</p>
        )}
    </div>
  );
};

export default CardGrid;
