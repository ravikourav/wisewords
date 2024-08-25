import React, { useEffect, useState } from 'react';
import ExploreCard from '../components/ExploreCard';
import CardGrid from '../components/CardGrid.js';
import { ReactComponent as BackImg } from '../assets/icon/arrow-back.svg';
import { ReactComponent as SearchIcon } from '../assets/icon/search.svg';
import './css/Explore.css';
import { Masonry } from '@mui/lab';

import { useIsMobile } from '../utils/screenSize.js';
import axios from 'axios';
import Loading from '../components/Loading.js';

function Explore() {
  
  const isMobile = useIsMobile();

  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedTagPosts, setSelectedTagPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllTags();
  }, []);

  const fetchAllTags = async () => {
    const endpoint = '/api/tag/all';
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

  const handleCardClick = async (card) => {
    const endPoint = `/api/tag/${card._id}/posts`;
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

  const breakpointCols = {
    lg: 5,
    md: 4,
    sm: 3,
    xs: 2,
  };

  return (
    <div className='explore-page-layout'>
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
          <div className='card-layout'>
            <Masonry columns={breakpointCols} spacing={2}>
              {tags.map((card, index) => (
                <ExploreCard
                  key={index}
                  name={card.tag}
                  background={card.imageURL}
                  slogan={card.tagLine}
                  onClick={() => handleCardClick(card)}
                />
              ))}
            </Masonry>
          </div>
        ) : (
          <div className='tag-card-layout'>
            <BackImg className='close' onClick={closeSelectedTag} />
            <ExploreCard
              className='tagSelected'
              name={selectedTag.tag}
              background={selectedTag.imageURL}
              slogan={selectedTag.tagLine}
            />
            {selectedTagPosts.length > 0 ? (
              <CardGrid data={selectedTagPosts} />
            ) : (
              <p>The silence of this tag remains unbroken</p>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default Explore;
