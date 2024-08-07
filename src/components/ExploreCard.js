import React from 'react'
import './css/Card.css';

function ExploreCard(props) {
  return (
    <div className='card card-margin' onClick={props.onClick} >
      <img className='bg-img small' src={props.background} alt=''/>
      <div className='explore-bg-tint'>
        <p className='explore-card-name'>{props.name}</p>
        <p className='explore-card-slogan'>{props.slogan}</p>
      </div>
    </div>
  )
}

export default ExploreCard;