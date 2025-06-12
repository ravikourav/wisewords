import React from 'react'
import './css/BackButton.css';
import { ReactComponent as BackIcon } from '../assets/icon/arrow-back.svg';

function BackButton({type, onClick}) {
  
  return (
    <BackIcon className={type === 'fixed' ? 'close close-fixed' : 'close'} onClick={onClick} />
  )
}

export default BackButton