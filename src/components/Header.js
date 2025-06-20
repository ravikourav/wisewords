import React, { useState , useEffect, useContext } from 'react';
import './css/Header.css';
import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import NotificationModel from '../screens/NotificationModel.js';
import {  useAuth } from '../context/AuthContext.js';
import Button from './Button.js';

//icons
import { ReactComponent as HomeIcon } from '../assets/icon/home.svg';
import { ReactComponent as AddIcon} from '../assets/icon/add.svg';
import { ReactComponent as CategoryIcon} from '../assets/icon/category.svg';
import { ReactComponent as BellIcon} from '../assets/icon/bell.svg';
import { ReactComponent as ProfileIcon } from '../assets/icon/profile.svg';
import RenderProfileImage from './RenderProfileImage.js';

function Header()  {
  const location = useLocation();
  const [Selected , setSelected] = useState(location);
  const { isLoggedIn, user} = useAuth();

  const [notificationBgPage , setNotificationBgPage] = useState();

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const path = location.pathname.substring(1) || 'Home';
    setSelected(path.charAt(0).toUpperCase() + path.slice(1));
  }, [location]);

  const select = (clicked) => {
    setSelected(clicked);
  };

  useEffect(()=>{
    select(notificationBgPage);
  },[isMobile])

  const handleNotification = () => {
    if(Selected !== 'Notification'){
      setNotificationBgPage(Selected);
      select('Notification');
    }
    else{
      select(notificationBgPage);
    }
  }

  return (
    <div className='header-root'>
      {!isMobile ? (
      <div className="header-container-desktop">
        <img className="header-logo" src="/logo192.png" alt="Logo" />
          <Link to="/" onClick={()=>{select('Home')}}>
            <HomeIcon className='icon' 
              fill={Selected === 'Home' ? 'black' : 'white'} 
              stroke={Selected === 'Home' ? 'white' :'black' } 
            />
          </Link>
          <Link to="explore" onClick={()=>{select('Explore')}}>
            <CategoryIcon className='icon' fill={ Selected === 'Explore' ? 
              'black' : 'white' } stroke={Selected === 'Explore' ? 
              'white' : 'black'} />
          </Link>
          { isLoggedIn && (
          <Link to="create" onClick={()=>{select('Create')}}>
            <AddIcon fill={ Selected === 'Create' ? 
              'black' : 'white' } stroke={Selected === 'Create' ? 
              'white' : 'black'} className='icon' />
          </Link>)}
          {isLoggedIn ? (
            <>
              <BellIcon fill={Selected === 'Notification' ? 'black' : 'white'} stroke={Selected === 'Notification' ? 'white' :'black' } className='icon'
              onClick={handleNotification} /> 
              <Link to={`user/${user.username}`} onClick={()=>{select('Profile')}} >
                <RenderProfileImage source={user.profile} className='icon' />
              </Link>
            </>
          ) : (
            <Button text='Login' to='login' onClick={()=>{select('Login')}} />
          )}
      </div>
      ):(
        <div className="header-container-mobile">
          <Link to="/" onClick={()=>{select('Home')}}>
            <HomeIcon fill={ Selected === 'Home' ? 
              'black' : 'white' } stroke={Selected === 'Home' ? 
              'white' : 'black'} className='icon' />
          </Link>
          <Link to="explore" onClick={()=>{select('Explore')}}>
            <CategoryIcon fill={ Selected === 'Explore' ? 
              'black' : 'white' } stroke={Selected === 'Explore' ? 
              'white' : 'black'} className='icon' />
          </Link>
          { isLoggedIn && (
            <Link to="create" onClick={()=>{select('Create')}}>
              <AddIcon fill={ Selected === 'Create' ? 
              'black' : 'white' } stroke={Selected === 'Create' ? 
              'white' : 'black'} className='icon' />
            </Link>
          )}
          {isLoggedIn ? 
            <Link to={`user/${user.username}`} onClick={()=>{select('Profile');}} >
              <RenderProfileImage source={user.profile} className='icon' />
            </Link>
          : 
            <Link to='login' onClick={()=>{select('Login')}} >
              <ProfileIcon fill={Selected === 'Login' ? 'black' : 'white'} className= 'icon' />
            </Link>
          }
        </div>
      )}    

      {Selected === 'Notification' && 
        <div className='notification-model'>
          <div className='notification-header'>
            <p className='notification-title'>Updates</p>
          </div>
          <NotificationModel />
        </div>
      }
    </div>
  );
}

export default Header;
