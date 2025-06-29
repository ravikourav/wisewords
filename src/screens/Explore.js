import React, { useEffect, useState } from 'react';
import ExploreCard from '../components/ExploreCard';
import CardGrid from '../components/CardGrid.js';
import './css/Explore.css';
import { useAlert } from '../context/AlertContext.js';
import axios from 'axios';
import Loading from '../components/Loading.js';
import SearchBar from '../components/SearchBar.js';
import BackButton from '../components/BackButton.js';
import Button from '../components/Button.js';
import { useCategories } from '../context/CategoryContext';
import { useTags } from '../context/TagContext.js';

function Explore() {
  const { showAlert } = useAlert();
  const { categories, loadingCategories } = useCategories();
  const { tags, loadingTags } = useTags();
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [resultPosts, setResultPosts] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchPosts = async ({ card, type, nextPage = 1, append = false }) => {

    if (nextPage > totalPages && append) return;
    setLoading(true);
    try {
      const baseURL = process.env.REACT_APP_BACKEND_API_URL;
      const url = `${baseURL}/api/${type}/${card._id}/posts?page=${nextPage}&limit=9`;

      const response = await axios.get(url);
      const posts = response.data.posts;
      const pages = response.data.totalPages;

      if (append) {
        setResultPosts(prev => [...prev, ...posts]);
      } else {
        setResultPosts(posts);
        setSelectedCard(card);
        setSelectedType(type);
      }

      setPage(nextPage);
      setTotalPages(pages);
    } catch (err) {
      showAlert('Unable to fetch posts', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeSelectedTag = () => {
    setResultPosts([]);
    setSelectedCard(null);
  };

  return (
    <div className='page-root'>
      <div className="searchbar-header-container">
        {selectedCard && <BackButton onClick={closeSelectedTag} />}
        <SearchBar />
      </div>
      {!selectedCard ? (
        <>
          <p className='explore-card-header-label'>Categories</p>
          {loadingCategories ? <Loading /> :
            <div className='explore-card-grid'>
              {categories.map((card, index) => (
                <ExploreCard
                  key={index}
                  name={card.name}
                  background={card.backgroundImage}
                  slogan={card.description}
                  postCount={card.postCount}
                  onClick={() => fetchPosts({card, type: 'category'})}
                />
              ))}
            </div>
          }

          <p className='explore-card-header-label'>Tags</p>
          {loadingTags ? <Loading /> :
            <div className='explore-card-grid'>
              {tags.map((card, index) => (
                <ExploreCard
                  key={index}
                  name={card.name}
                  background={card.backgroundImage}
                  slogan={card.description}
                  postCount={card.postCount}
                  onClick={() => fetchPosts({ card, type: 'tag' })}
                />
              ))}
            </div>
          }
        </>
        ) : (
          loading ? <Loading /> :
            <div className='explore-card-selected-layout'>
              <ExploreCard
                className='cardSelected'
                name={selectedCard.name}
                background={selectedCard.backgroundImage}
                slogan={selectedCard.description}
                postCount={selectedCard.postCount}
              />
              <div className='explore-result-post-container'>
                {resultPosts.length > 0 ? (
                  <>
                    <CardGrid data={resultPosts} />
                    { page < totalPages &&
                      <div className='paginate-container'>
                        <Button 
                          text='More' 
                          onClick={() => fetchPosts({ card: selectedCard, type: selectedType, nextPage: page + 1, append: true })}/>
                      </div>
                    }
                  </>
                ) : (
                  <div className='empty-state-container'>
                    <p className='empty-state-message'>The silence of this {selectedType} remains unbroken.</p>
                  </div>
                )}
              </div>
            </div>
        )
      }
    </div>    
  );
}

export default Explore;
