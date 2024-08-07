import React, { useState } from 'react';
import './css/CardGrid.css';
import Card from './Card.js';
import DetailedCard from './DetailedCard';

const CardGrid = ({ data }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    speechSynthesis.cancel();
    setSelectedCard(null);
  };

  return (
    <>
      {!selectedCard ? (
        <div className='card-layout'>
          {data.map((card, index) => (
            <Card
              key={index}
              size='medium'
              margin={true}
              content={card.content}
              textColor={card.contentColor}
              author={card.author}
              background={card.background}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      ) : (
        <DetailedCard selectedCard={selectedCard} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default CardGrid;
