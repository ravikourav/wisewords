import React from 'react';
import adjustColorBrightness from '../utils/adjustColorBrightness';

const Card = (props) => {

  const dullAuthorColor = adjustColorBrightness(props.textColor, 50)

  return (
    <div className={`card ${props.margin ? 'card-margin' : ''}`} onClick={props.onClick} >
      <img className={`bg-img ${props.size}`} src={props.background} alt='' />
      <div className='card-bg-tint' >
        <p style={{ color: props.textColor }} className='content'>{props.content}</p>
        <p style={{ color: dullAuthorColor }} className='author'>{'-' + props.author}</p>
      </div>
    </div>
  );
};

export default Card;
