import React from 'react';
import laodingGif from '../assets/gif/loading.gif';

function Loading() {
  return (
    <div style={{display: 'flex', alignContent: 'center' , justifyItems: 'center' , alignItems: 'center' ,height: '50vh' , width: '100vw', justifyContent: 'center'}}>
        <img src={laodingGif} alt=''/>
    </div>
  )
}

export default Loading;