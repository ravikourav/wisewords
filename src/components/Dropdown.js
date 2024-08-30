import React, { useState, useEffect } from 'react';
import './css/Dropdown.css';
import IconButton from './IconButton';
import { ReactComponent as DotmenuIcon } from '../assets/icon/dot-menu.svg';

const Dropdown = ({ options, showIcon, handleMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    if (option.onClick) {
      option.onClick();
    }
    setIsOpen(false); // Close dropdown after selecting an option
  };

  useEffect(() => {
    // Sync isOpen with handleMenu state when showIcon is false
    if (!showIcon) {
      setIsOpen(handleMenu);
    }
  }, [handleMenu, showIcon]);

  return (
    <div className="dropdown">
      {showIcon && (
        <IconButton icon={DotmenuIcon} size="30px" onClick={toggleDropdown} />
      )}
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option, index) => (
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
  );
};

export default Dropdown;
