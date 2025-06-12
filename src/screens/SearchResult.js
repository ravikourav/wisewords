import './css/SearchResult.css';
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CardGrid from '../components/CardGrid';
import { useIsMobile } from '../utils/screenSize.js';
import Badge from '../components/Badge';
import SearchBar from '../components/SearchBar.js';

import { ReactComponent as ProfileIcon } from '../assets/icon/profile.svg';
import BackButton from '../components/BackButton.js';

function SearchResult() {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const navigate = useNavigate();
  const [data, setData] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); 
  

  const fetchData = async (query) => {
    try {
      setLoading(true);
      const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/search/`;
      const response = await axios.put(endpoint, { query }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (username) => {
    navigate(`/user/${username}`);
  };

  useEffect(() => {
    const q = searchParams.get('query') || '';
    setQuery(q.trim());

    if (q !== '') {
      fetchData(q);
    } else {
      setLoading(false);
    }
}, [searchParams]);

  const onSearch = (value) => {
    setSearchParams({ query: value }); 
  }


  return (
    loading ? <Loading /> : 
    <>
      {isMobile && (
        <div className="explore-search-header">
          { query && isMobile &&
            <div className='search-result-back-icon-container' >
              <BackButton onClick={()=>navigate(-1)}/>
            </div>
          }
          <SearchBar onSearch={onSearch} initialValue={searchParams.get('query') || ''} />
        </div>
      )}
      <div className='search-result-root'>
        {/* Tab Bar */}
        <div className='search-result-tab-bar'>
          <button
            className={`search-result-tab-button ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button
            className={`search-result-tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        {/* Tab Content */}
          {activeTab === 'posts' ? (
            data.posts.length ? (
              <CardGrid data={data.posts} />
            ) 
            : 
            <div className='empty-state-container'>
              <p className='empty-state-message' >No posts found.</p>
            </div>
          ) : (
            data.users.length ? (
              <div className='search-result-content'>{
                data.users.map((user) => (
                  <div key={user._id} className='search-result-user-card' onClick={()=>handleProfileClick(user.username)}>
                    {user.profile ?
                      <img src={user.profile} alt='' className='search-result-profile-img' />
                    :
                      <ProfileIcon fill='#ccc' className='search-result-profile-img' />
                    }
                    <div className='search-result-user-info'>
                      <h3 className='search-result-user-name'>{user.name} <Badge badge={user.badge} size={26}/></h3>
                      <h3 className='search-result-user-username'>@{user.username}</h3>
                    </div>
                  </div>
                ))
              }</div>
            ) : 
              <div className='empty-state-container'>
                <p className='message'>No users found.</p>
              </div>
          )}
      </div>
    </>
  );
}

export default SearchResult;