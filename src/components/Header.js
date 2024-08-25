import React, { useState , useEffect, useContext} from 'react';
import './css/Header.css';
import placeholder from '../assets/icon/profile.png';
import { Link , useLocation, useSearchParams } from 'react-router-dom';

import { useMediaQuery } from 'react-responsive';

import { ReactComponent as HomeIcon } from '../assets/icon/home.svg';
import { ReactComponent as AddIcon} from '../assets/icon/add.svg';
import { ReactComponent as CategoryIcon} from '../assets/icon/category.svg';
import { ReactComponent as BellIcon} from '../assets/icon/bell.svg';

import NotificationModel from './NotificationModel.js';

import {  AuthContext } from '../hooks/AuthContext.js';
import Button from './Button.js';

function Header()  {
  const location = useLocation();
  const [searchParams , setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [Selected , setSelected] = useState(location);
  const { isLoggedIn , user } = useContext(AuthContext);

  const [notificationBgPage , setNotificationBgPage] = useState();
  const [notificationOpened , setNotificationOpened] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const path = location.pathname.substring(1) || 'Home';
    setSelected(path.charAt(0).toUpperCase() + path.slice(1));
  }, [location]);

  const select = (clicked) => {
    setSelected(clicked);
  };

  const handleNotification = () => {
    if(!notificationOpened){
      setNotificationBgPage(Selected);
      select('Notification');
      setNotificationOpened(true);
    }
    else{
      select(notificationBgPage);
      setNotificationOpened(false);
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (e.key === 'Enter') {
      setSearchParams({
        search: value
      });
    }
  }

  return (
    <div className='header-root' >
      {!isMobile ? (
      <div className="header-container">
        <img className="header-logo" src="/logo192.png" alt="Logo" />
        <div className="nav-links">
          <Link className={`desktop-nav-link ${Selected === 'Home' ? 'nav-selected' : '' }`} to="/" onClick={()=>{select('Home')}}>Home</Link>
          <Link className={`desktop-nav-link ${Selected === 'Explore' ? 'nav-selected' : '' }`} to="explore" onClick={()=>{select('Explore')}}>Explore</Link>
          { isLoggedIn && (
          <Link className={`desktop-nav-link ${Selected === 'Create' ? 'nav-selected' : '' }`} to="create" onClick={()=>{select('Create')}}>Create</Link>)}
        </div>
        <div className="search-container">
          <input type="text" placeholder="Search" value={search} className="main-input search-input" onChange={handleSearch} onKeyDown={handleSearch}/>
        </div>
        <div className="header-user-container">
          {isLoggedIn ? (
            <div className='left-nav-links'>
              <BellIcon fill={Selected === 'Notification' ? 'black' : 'white'} stroke={Selected === 'Notification' ? 'white' :'#767676' } className='icon'
              onClick={handleNotification} />
              <Link to={`/profile/${user.user.username}`} onClick={()=>{select('Profile')}} >
                <img className= 'profile-picture' src={placeholder} alt="User" />
              </Link>
            </div>
          ) : (
            <Button text='Login' to='login' onClick={()=>{select('Login')}} />
          )}
        </div>
      </div>
      ):(
        <div className="header-container">
            <Link to="/" onClick={()=>{select('Home')}}>
              <HomeIcon fill={ Selected === 'Home' ? 
                'black' : 'white' } stroke={Selected === 'Home' ? 
                'white' : '#767676'} className='nav-icon' />
            </Link>
            <Link to="explore" onClick={()=>{select('Explore')}}>
              <CategoryIcon fill={ Selected === 'Explore' ? 
                'black' : 'white' } stroke={Selected === 'Explore' ? 
                'white' : '#767676'} className='nav-icon' />
            </Link>
            { isLoggedIn && (
              <Link to="create" onClick={()=>{select('Create')}}>
                <AddIcon fill={ Selected === 'Create' ? 
                'black' : 'white' } stroke={Selected === 'Create' ? 
                'white' : '#767676'} className='nav-icon' />
              </Link>
            )}
            {isLoggedIn ? (
            <>
              <BellIcon fill={Selected === 'Notification' ? 'black' : 'white'} stroke={Selected === 'Notification' ? 'white' :'#767676' } className='nav-icon'
              onClick={handleNotification} />
              <Link to={`profile/${user.user.username}`} onClick={()=>{select('Profile'); console.log('Navigating to profile:', user.user.username);}} >
                <img className= 'nav-icon' src={placeholder} alt="User" />
              </Link>
            </>
            ) : (
              <Button text='Login' to='login' onClick={()=>{select('Login')}} />
            )}
        </div>
      )}    

      {Selected === 'Notification' && <NotificationModel />}
    </div>
  );
}

export default Header;
