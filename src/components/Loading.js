import React from 'react';
import { PuffLoader } from "react-spinners";

function Loading() {
  return (
    <div style={{display: 'flex', alignContent: 'center' , justifyItems: 'center' , alignItems: 'center' ,height: '100vh' , width: '100vw', justifyContent: 'center'}}>
        <PuffLoader
          size={50}
        />
    </div>
  )
}

export default Loading;