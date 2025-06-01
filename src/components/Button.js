import React from 'react';
import { Link } from 'react-router-dom';

function Button({ selected, disabled, width, text, onClick, to  , align , type}) {
    
    const buttonClass = `button ${selected ? 'button-selected' : 'main-button'} ${disabled ? 'button-disabled' : ''}`;

    if (to) {
        // If 'to' prop is provided, render as a Link
        return (
            <Link
            to={to}
            className={buttonClass}
            style={{ width: typeof width === 'number' ? `${width}px` : width , alignSelf : `${align}`}}
            onClick={disabled ? null : onClick}
            >
            {text}
            </Link>
        );
    }

  return (
    <button 
        className={buttonClass}
        disabled={disabled} 
        style={{ width: `${width}px` , alignSelf : `${align}` }}
        onClick={disabled ? null : onClick}
        type={type || 'button'}
    >
        {text}
    </button>
  )
}

export default Button