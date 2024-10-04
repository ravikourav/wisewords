import React, { useEffect, useState } from 'react';
import ExploreCard from '../components/ExploreCard';
import CardGrid from '../components/CardGrid.js';
import { ReactComponent as BackImg } from '../assets/icon/arrow-back.svg';
import { ReactComponent as SearchIcon } from '../assets/icon/search.svg';
import './css/Explore.css';
import Alert from '../components/Alert.js';
import { useIsMobile } from '../utils/screenSize.js';
import axios from 'axios';
import Loading from '../components/Loading.js';

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
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/tag/all`;
    try {
      setLoading(true);
      const response = await axios.get(endpoint);
      setTags(response.data);
    } catch (err) {
      setUserAlert({ message: 'Unable to Load Tags' , type: 'error', visible: true });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (card) => {
    const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/tag/${card._id}/posts`;
    try {
      setLoading(true);
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
    <div className='explore-page'>
      {isMobile && !selectedTag && (
        <div className="explore-search-header">
          <div className='custom-search-box'>
            <SearchIcon className='search-icon'/>
            <input type="text" placeholder="Search" className="mobile-search-input " />
          </div>
        </div>
        )}
        {loading ? <Loading /> : (
         !selectedTag ? (
          <div className='explore-tag-layout'>
            <div className='explore-card-grid'>
              {tags.map((card, index) => (
                <ExploreCard
                  key={index}
                  name={card.tag}
                  background={card.backgroundImage}
                  slogan={card.tagLine}
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
            <BackImg className='close' onClick={closeSelectedTag} />
            <ExploreCard
              className='tagSelected'
              name={selectedTag.tag}
              background={selectedTag.backgroundImage}
              slogan={selectedTag.tagLine}
            />
            <div className='tag-post-container'>
              {selectedTagPosts.length > 0 ? (
                <CardGrid data={selectedTagPosts} />
              ) : (
                <p className='suggestion'>The silence of this tag remains unbroken</p>
              )}
            </div>
          </div>
        )
      )}
    </div>    
  );
}

export default Explore;
