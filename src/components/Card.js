import React from 'react';
import './css/Card.css';

const Card = (props) => {
  
  const size = {
    width: props.width || 'auto'
  };

  return (
    <div style={props.sizeCustom && size } className={`card ${props.margin ? 'card-margin' : ''} ${props.sampleSize && `${props.sampleSize}`}`} onClick={props.onClick} >
      <img className={`bg-img ${props.sampleSize && `${props.sampleSize}`}`} src={props.background} alt='' />
      <div className='card-bg-tint' style={{backgroundColor : `${props.tint}` }} >
        <p style={{ color: props.textColor }} className='content'>{props.content}</p>
        <p style={{ color: props.authorColor }} className='author'>{'-' + props.author}</p>
      </div>
    </div>
  );
};

export default Card;
