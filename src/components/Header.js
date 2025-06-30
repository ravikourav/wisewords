import { useState , useEffect} from 'react';
import './css/Header.css';
import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import NotificationModel from '../screens/NotificationModel.js';
import {  useAuth } from '../context/AuthContext.js';
import { useNotification } from '../context/NotificationContext.js';
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
  const { unreadCount } = useNotification();
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
  },[isMobile , notificationBgPage])

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
              <div style={{ position: 'relative' }}>
                <BellIcon
                  fill={Selected === 'Notification' ? 'black' : 'white'}
                  stroke={Selected === 'Notification' ? 'white' : 'black'}
                  className='icon'
                  onClick={handleNotification}
                />

                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      border: '3px solid white',
                      right: 2,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: 'red',
                    }}
                  />
                )}
              </div>
              <Link to={`user/${user.username}`} onClick={()=>{select('Profile')}} >
                <RenderProfileImage source={user.profile} className='icon' />
              </Link>
            </>
          ) : (
            <Link to='login' onClick={()=>{select('Login')}} >
              <ProfileIcon stroke={Selected === 'Login' ? '#FF000000' : 'black' } fill={Selected === 'Login' ? 'black' : 'white'} className= 'icon' />
            </Link>
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
              <div style={{ position: 'relative' }}>
                <RenderProfileImage source={user.profile} className='icon' />
                {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 2,
                        border: '3px solid white',
                        right: 2,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: 'red',
                      }}
                    />
                  )}
              </div>
            </Link>
          : 
            <Link to='login' onClick={()=>{select('Login')}} >
              <ProfileIcon stroke={Selected === 'Login' ? '#FF000000' : 'black' } fill={Selected === 'Login' ? 'black' : 'white'} className= 'icon' />
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
