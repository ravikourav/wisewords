import React from 'react'
import './css/BackButton.css';
import { ReactComponent as BackIcon } from '../assets/icon/arrow-back.svg';

function BackButton({onClick}) {
  return (
    <BackIcon className='close' onClick={onClick}/>
  )
}

export default BackButton