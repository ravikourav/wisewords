import React from 'react';
import './css/IconButton.css';

function IconButton({ className , icon: Icon, onClick , disabled, size}) {

    const buttonStyle = {
        width: size || '40px',
        height: size || '40px',
    };

    const combinedClassName = `${disabled ? 'iconButtonDisabled' : 'iconButton'} ${className || ''}`.trim();

    return (
        <Icon 
            className={combinedClassName} 
            style={buttonStyle}
            onClick={!disabled ? onClick : undefined} 
        />
    );
}

export default IconButton;
