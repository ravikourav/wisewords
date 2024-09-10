import React from 'react'
import './css/BackButton.css';
import { ReactComponent as BackIcon } from '../assets/icon/arrow-back.svg';

function BackButton({onClick , marginFromTop}) {

  const buttonStyle = marginFromTop ? { top: `${marginFromTop}px` } : {};
  
  return (
    <BackIcon className='close' onClick={onClick} style={buttonStyle} />
  )
}

export default BackButton