import React from 'react';

const Card = (props) => {

  return (
    <div className={`card ${props.margin ? 'card-margin' : ''}`} onClick={props.onClick} >
      <img className='bg-img' src={props.background} alt='' />
      <div className='card-bg-tint' style={{backgroundColor : `${props.tint}` }} >
        <p style={{ color: props.textColor }} className='content'>{props.content}</p>
        <p style={{ color: props.authorColor }} className='author'>{'-' + props.author}</p>
      </div>
    </div>
  );
};

export default Card;
