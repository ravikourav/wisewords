import React, { useState } from 'react';
import './css/CardGrid.css';
import Card from './Card.js';
import { Masonry } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

const CardGrid = ({ data }) => {
  const navigate = useNavigate();


  const handleCardClick = (card) => {
    navigate(`/post/${card._id}`);
  };

  const handleCloseModal = () => {
    speechSynthesis.cancel();
  };

  const breakpointCols = {
    lg: 4,
    md: 3,
    sm: 2,
    xs: 1,
  };

  return (
    <div className='card-layout'>
        {data.length > 0 ? (
          <Masonry columns={breakpointCols} spacing={2}>
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
