import React, { useState , useEffect, useContext } from 'react';
import './css/Header.css';
import { Link , useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import NotificationModel from '../screens/NotificationModel.js';
import {  AuthContext } from '../hooks/AuthContext.js';
import Button from './Button.js';
import SearchBar from './SearchBar.js';

//icons
import { ReactComponent as HomeIcon } from '../assets/icon/home.svg';
import { ReactComponent as AddIcon} from '../assets/icon/add.svg';
import { ReactComponent as CategoryIcon} from '../assets/icon/category.svg';
import { ReactComponent as BellIcon} from '../assets/icon/bell.svg';
import { ReactComponent as ProfileIcon } from '../assets/icon/profile.svg';

function Header()  {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [Selected , setSelected] = useState(location);
  const { isLoggedIn, user} = useContext(AuthContext);

  const [notificationBgPage , setNotificationBgPage] = useState();

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const path = location.pathname.substring(1) || 'Home';
    setSelected(path.charAt(0).toUpperCase() + path.slice(1));
  }, [location]);

  const select = (clicked) => {
    setSelected(clicked);
  };

  const handleNotification = () => {
    if(Selected !== 'Notification'){
      setNotificationBgPage(Selected);
      select('Notification');
    }
    else{
      select(notificationBgPage);
    }
  }

  const onSearch = (value) => {
    navigate(`/search?query=${encodeURIComponent(value)}`);
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
                { user.profile ?
                  <img src={user.profile} alt='' className='icon' />
                :
                  <ProfileIcon fill={Selected === 'Profile' ? 'black' : '#ccc'} className= 'icon'/>
                }
              </Link>
            </>
          ) : (
            <Button text='Login' to='login' onClick={()=>{select('Login')}} />
          )}
      
        {/*<div className="search-container">
          <SearchBar onSearch={onSearch} initialValue={searchParams.get('query') || ''} />
        </div>*/}
      </div>
      ):(
        <div className="header-container-mobile">
          <Link to="/" onClick={()=>{select('Home')}}>
            <HomeIcon fill={ Selected === 'Home' ? 
              'black' : 'white' } stroke={Selected === 'Home' ? 
              'white' : '#767676'} className='icon' />
          </Link>
          <Link to="explore" onClick={()=>{select('Explore')}}>
            <CategoryIcon fill={ Selected === 'Explore' ? 
              'black' : 'white' } stroke={Selected === 'Explore' ? 
              'white' : '#767676'} className='icon' />
          </Link>
          { isLoggedIn && (
            <Link to="create" onClick={()=>{select('Create')}}>
              <AddIcon fill={ Selected === 'Create' ? 
              'black' : 'white' } stroke={Selected === 'Create' ? 
              'white' : '#767676'} className='icon' />
            </Link>
          )}
          {isLoggedIn ? (
          <>
            <BellIcon fill={Selected === 'Notification' ? 'black' : 'white'} stroke={Selected === 'Notification' ? 'white' :'#767676' } className='icon'
            onClick={handleNotification} />
            <Link to={`user/${user.username}`} onClick={()=>{select('Profile');}} >
              { user.profile ?
                <img src={user.profile} alt='' className='icon' />
              :
                <ProfileIcon fill={Selected === 'Profile' ? 'black' : '#ccc'} className= 'icon' alt="User"/>
              }
            </Link>
          </>
          ) : (
            <Link to='login' onClick={()=>{select('Login')}} >
              <ProfileIcon fill={Selected === 'Login' ? 'black' : '#ccc'} className= 'icon' />
            </Link>
          )}
        </div>
      )}    

      {Selected === 'Notification' && <NotificationModel />}
    </div>
  );
}

export default Header;
