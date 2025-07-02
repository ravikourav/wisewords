import { useEffect, useState } from 'react';
import './css/Header.css';
import { NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useAuth } from '../context/AuthContext.js';
import { useNotification } from '../context/NotificationContext.js';

import NotificationModel from './NotificationModel.js';
import RenderProfileImage from './RenderProfileImage.js';

// icons
import { ReactComponent as HomeIcon } from '../assets/icon/home.svg';
import { ReactComponent as AddIcon } from '../assets/icon/add.svg';
import { ReactComponent as CategoryIcon } from '../assets/icon/category.svg';
import { ReactComponent as BellIcon } from '../assets/icon/bell.svg';
import { ReactComponent as ProfileIcon } from '../assets/icon/profile.svg';
import { ReactComponent as AboutIcon } from '../assets/icon/info.svg';

function Header() {
  const { isLoggedIn, user } = useAuth();
  const { unreadCount } = useNotification();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const [showingNotification, setShowingNotification] = useState(false);

  useEffect(() => {
    if(isMobile && showingNotification) {
      setShowingNotification(false); // Close notification on mobile when screen size changes
    }
  }, [isMobile, showingNotification]);

  const handleNotification = () => {
    if (!showingNotification) {
      setShowingNotification(true);
    } else {
      setShowingNotification(false);
    }
  };

  const renderNotificationIcon = () => (
    <div style={{ position: 'relative' }}>
      <BellIcon
        className="icon"
        fill={showingNotification ? 'black' : 'white'}
        stroke={showingNotification ? 'white' : 'black'}
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
  );

  return (
    <div className="header-root">
      {!isMobile ? (
        // Desktop Header
        <>
          <div className="header-container-desktop">
            <div className="header-top-icon-container">
              <img className="header-logo" src="/logo192.png" alt="Logo" />

              <NavLink to="/" className="icon-link">
                {({ isActive }) => (
                  <HomeIcon
                    className="icon"
                    fill={isActive ? 'black' : 'white'}
                    stroke={isActive ? 'white' : 'black'}
                  />
                )}
              </NavLink>

              <NavLink to="/explore" className="icon-link">
                {({ isActive }) => (
                  <CategoryIcon
                    className="icon"
                    fill={isActive ? 'black' : 'white'}
                    stroke={isActive ? 'white' : 'black'}
                  />
                )}
              </NavLink>

              {isLoggedIn && (
                <NavLink to="/create" className="icon-link">
                  {({ isActive }) => (
                    <AddIcon
                      className="icon"
                      fill={isActive ? 'black' : 'white'}
                      stroke={isActive ? 'white' : 'black'}
                    />
                  )}
                </NavLink>
              )}

              {isLoggedIn ? (
                <>
                  {renderNotificationIcon()}
                  <NavLink to={`/user/${user.username}`} className="icon-link">
                    {({ isActive }) => (
                      <RenderProfileImage
                        source={user.profile}
                        className="icon"
                        style={{
                          border: isActive ? '2px solid white' : 'none',
                          borderRadius: '50%',
                        }}
                      />
                    )}
                  </NavLink>
                </>
              ) : (
                <NavLink to="/login" className="icon-link">
                  {({ isActive }) => (
                    <ProfileIcon
                      className="icon"
                      fill={isActive ? 'black' : 'white'}
                      stroke={isActive ? 'white' : 'black'}
                    />
                  )}
                </NavLink>
              )}
            </div>

            <NavLink to="/about" className="icon-link">
              {({ isActive }) => (
                <AboutIcon
                  className={`header-info-icon ${isActive ? 'header-info-icon-selected' : ''}`}
                  fill={isActive ? 'white' : 'black'}
                />
              )}
            </NavLink>
          </div>
          {showingNotification && (
            <div className="notification-model">
              <div className="notification-header">
                <p className="notification-title">Updates</p>
              </div>
              <NotificationModel />
            </div>
          )}
        </>
      ) : (
        // Mobile Header
        <div className="header-container-mobile">
          <NavLink to="/" className="icon-link">
            {({ isActive }) => (
              <HomeIcon
                className="icon"
                fill={isActive ? 'black' : 'white'}
                stroke={isActive ? 'white' : 'black'}
              />
            )}
          </NavLink>

          <NavLink to="/explore" className="icon-link">
            {({ isActive }) => (
              <CategoryIcon
                className="icon"
                fill={isActive ? 'black' : 'white'}
                stroke={isActive ? 'white' : 'black'}
              />
            )}
          </NavLink>

          {isLoggedIn && (
            <NavLink to="/create" className="icon-link">
              {({ isActive }) => (
                <AddIcon
                  className="icon"
                  fill={isActive ? 'black' : 'white'}
                  stroke={isActive ? 'white' : 'black'}
                />
              )}
            </NavLink>
          )}

          {isLoggedIn ? (
            <NavLink to={`/user/${user.username}`} className="icon-link">
              <div style={{ position: 'relative' }}>
                <RenderProfileImage source={user.profile} className="icon" />
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
            </NavLink>
          ) : (
            <NavLink to="/login" className="icon-link">
              {({ isActive }) => (
                <ProfileIcon
                  className="icon"
                  fill={isActive ? 'black' : 'white'}
                  stroke={isActive ? 'white' : 'black'}
                />
              )}
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
