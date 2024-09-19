import React from 'react'
import './css/ExploreCard.css';

function ExploreCard(props) {
  return (
    <div className='explore-card' onClick={props.onClick} >
      <img className={`img-fit ${props.className}`} src={props.background} alt=''/>
      <div className='explore-bg-tint'>
        <p className='explore-card-name'>{props.name}</p>
        <p className='explore-card-slogan'>{props.slogan}</p>
      </div>
    </div>
  )
}

export default ExploreCard;