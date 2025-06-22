import React, { useState, useEffect } from 'react';
import './css/Dropdown.css';
import IconButton from './IconButton';
import { ReactComponent as DotmenuIcon } from '../assets/icon/dot-menu.svg';
import Report from './Report';

const Dropdown = ({ options , iconColor, showIcon, handleMenu , size ,iconOrientation, menuPosition}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    if (option.onClick) {
      option.onClick();
    }
    setIsOpen(false); 
  };

  useEffect(() => {
    if (!showIcon) {
      setIsOpen(handleMenu);
    }
  }, [handleMenu, showIcon]);

  return (
    <>
      <div className="dropdown">
        {showIcon && (
          <IconButton icon={DotmenuIcon} fill={iconColor} size={size} onClick={toggleDropdown} className={`${iconOrientation === 'vertical' ? 'rotate-icon' : ''} ${isOpen ? 'icon-button-selected ' : 'icon-button-not-selected '}`} />
        )}
        {isOpen && (
          <ul className={`dropdown-menu ${menuPosition}`}>
            {options?.map((option, index) => (
              <li
                key={index}
                className="dropdown-item"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {showReportModal &&
        <Report />
      }
    </>
  );
};

export default Dropdown;
