import React, { useEffect, useState } from 'react';
import ExploreCard from '../components/ExploreCard';
import CardGrid from '../components/CardGrid.js';
import './css/Explore.css';
import Alert from '../components/Alert.js';
import { useIsMobile } from '../utils/screenSize.js';
import axios from 'axios';
import Loading from '../components/Loading.js';
import SearchBar from '../components/SearchBar.js';
import BackButton from '../components/BackButton.js';

function Explore() {
  
  const isMobile = useIsMobile();
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedTagPosts, setSelectedTagPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAlert, setUserAlert] = useState({ message: '', type: '', visible: false });

  useEffect(() => {
    fetchAllTags();
  }, []);

  const fetchAllTags = async () => {
    setLoading(true);
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/tag/all`;
    try {
      const response = await axios.get(endpoint);
      setTags(response.data);
    } catch (err) {
      setUserAlert({ message: 'Unable to Load Tags' , type: 'error', visible: true });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (card) => {
    setLoading(true);
    const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/tag/${card._id}/posts`;
    try {
      const response = await axios.get(endPoint);
      setSelectedTagPosts(response.data);
    } catch (err) {
      setUserAlert({ message: 'Unable to fetch Posts' , type: 'error', visible: true });
    } finally {
      setLoading(false);
    }
    setSelectedTag(card);
  };

  const closeSelectedTag = () => {
    setSelectedTagPosts([]);
    setSelectedTag(null);
  };

  return (
    loading ? <Loading /> :
    <div className='page-root'>
        <div className="explore-search-header">
          <SearchBar />
        </div>
        {!selectedTag ? (
          <div className='explore-tag-layout'>
            <div className='explore-card-grid'>
              {tags.map((card, index) => (
                <ExploreCard
                  key={index}
                  name={card.name}
                  background={card.backgroundImage}
                  slogan={card.description}
                  postCount={card.postCount}
                  onClick={() => handleCardClick(card)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className='explore-tag-selected-layout'>
            {userAlert.visible &&
              <Alert
                message={userAlert.message}
                type={userAlert.type}
                duration={3000}
                visible={userAlert.visible}
                setVisible={(isVisible) => setUserAlert((prev) => ({ ...prev, visible: isVisible }))}
              />
            }
            <BackButton type='fixed' onClick={closeSelectedTag} />
            <ExploreCard
              className='tagSelected'
              name={selectedTag.name}
              background={selectedTag.backgroundImage}
              slogan={selectedTag.description}
              postCount={selectedTag.postCount}
            />
            <div className='tag-post-container'>
              {selectedTagPosts.length > 0 ? (
                <CardGrid data={selectedTagPosts} />
              ) : (
                <div className='empty-state-container'>
                  <p className='empty-state-message'>The silence of this tag remains unbroken.</p>
                </div>
              )}
            </div>
          </div>
        )}
    </div>    
  );
}

export default Explore;
