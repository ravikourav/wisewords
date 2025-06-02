import './css/SearchResult.css';
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CardGrid from '../components/CardGrid';

import ProfileIcon from '../assets/icon/profile.svg';
import Badge from '../components/Badge';
function SearchResult() {
  const [ searchParams ] = useSearchParams();
  const query = searchParams.get('query');
  const navigate = useNavigate();
  const [data, setData] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); 

  const fetchData = async () => {
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
    if (query) {
      fetchData(query);
    }
  }, [query]);

  return (
    loading ? <Loading /> : 
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
            <p>No posts found.</p>
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
            ) : <p>No users found.</p>
          )}
      </div>
  );
}

export default SearchResult;