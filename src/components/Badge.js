import React from 'react';
import { ReactComponent as VerifiedIcon } from '../assets/icon/verified-check.svg';

function Badge({ badge , size }) {
  const badgeColors = {
    blue: '#007bff',  
    green: '#28a745',
    gold: '#ffaa00',
    none: 'transparent'
  };

  const fillColor = badge !== 'none' ? badgeColors[badge] : 'transparent';
  
  if (badge === 'none') {
    return null;
  }

  return (
    <VerifiedIcon fill={fillColor} width={`${size}px`} height={`${size}px`}/>
  );
}

export default Badge;
