import React, { useEffect, useState } from 'react';
import ExploreCard from '../components/ExploreCard';
import CardGrid from '../components/CardGrid.js';
import { ReactComponent as BackImg } from '../assets/icon/arrow-back.svg';
import { ReactComponent as SearchIcon } from '../assets/icon/search.svg';
import './css/Explore.css';
import { Masonry } from '@mui/lab';
import { getCurrentSize } from '../utils/resposiveSize.js';
import { useIsMobile } from '../utils/screenSize.js';
import axios from 'axios';
import Loading from '../components/Loading.js';

function Explore() {
  
  const isMobile = useIsMobile();

  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedTagPosts, setSelectedTagPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ currectSize, setCurrentSize] = useState(getCurrentSize());
  const [error, setError] = useState('');

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
      setError('Unable to fetch Tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setCurrentSize(getCurrentSize());
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCardClick = async (card) => {
    const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/tag/${card._id}/posts`;
    try {
      setLoading(true);
      const response = await axios.get(endPoint);
      setSelectedTagPosts(response.data);
    } catch (err) {
      setError('Unable to fetch Posts');
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
                  background={card.imageURL}
                  slogan={card.tagLine}
                  onClick={() => handleCardClick(card)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className='explore-tag-selected-layout'>
            <BackImg className='close' onClick={closeSelectedTag} />
            <ExploreCard
              className='tagSelected'
              name={selectedTag.tag}
              background={selectedTag.imageURL}
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
