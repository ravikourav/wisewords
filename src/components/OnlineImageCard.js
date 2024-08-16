import React from 'react';

function OnlineImageCard({ image, onSelect }) {
  return (
    <div className='online-image-card'>
      <img src={image} alt='Unable to load' className='card-image' onClick={onSelect} />
    </div>
  );
}

export default OnlineImageCard;
