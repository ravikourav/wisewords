import React, { useState } from 'react';
import './css/CardGrid.css';
import Card from './Card.js';
import DetailedCard from '../screens/DetailedCard.js';
import { Masonry } from '@mui/lab';

const CardGrid = ({ data }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardData, setCardData] = useState(data);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    speechSynthesis.cancel();
    setSelectedCard(null);
  };

  const handleUpdateCard = (updatedCard) => {
    setCardData((prevData) =>
      prevData.map((card) =>
        card._id === updatedCard._id ? updatedCard : card
      )
    );
  };

  const breakpointCols = {
    lg: 4,
    md: 3,
    sm: 2,
    xs: 1,
  };

  return (
    <>
      {!selectedCard ? (
        data.length > 0 ? (
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
          <p>No cards available</p>
        )
      ) : (
        <DetailedCard selectedCard={selectedCard} onClose={handleCloseModal} onUpdateCard={handleUpdateCard} />
      )}
    </>
  );
};

export default CardGrid;
