import React,{useState} from 'react';
import './css/Dropdown.css';
import IconButton from './IconButton';
import {ReactComponent as DotmenuIcon } from '../assets/icon/dot-menu.svg';

const Dropdown = ({ options }) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionClick = (option) => {
    if (option.onClick) {
      option.onClick();
    }
  };

  return (
    <div className="dropdown">
      <IconButton icon={DotmenuIcon} size='30px' onClick={toggleDropdown} />
      {isOpen && 
        <ul className="dropdown-menu">
          {options.map((option, index) => (
            <li key={index} className="dropdown-item" onClick={() => handleOptionClick(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      }
    </div>
  );
};

export default Dropdown;
