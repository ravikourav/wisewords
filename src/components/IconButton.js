import React from 'react';
import './css/IconButton.css';

function IconButton({ className , fill ,icon: Icon, onClick , disabled, size}) {

    const buttonStyle = {
        width: size || '40px',
        height: size || '40px',
    };

    const combinedClassName = `${disabled ? 'iconButtonDisabled' : 'iconButton'} ${className || ''}`.trim();

    return (
        <Icon 
            className={combinedClassName} 
            style={buttonStyle}
            fill={fill? fill : '#000000'}
            onClick={!disabled ? onClick : undefined} 
        />
    );
}

export default IconButton;
