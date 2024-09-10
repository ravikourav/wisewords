import React, { useState, useEffect } from 'react';
import './css/BrowseImage.css';
import BackButton from '../components/BackButton';
import OnlineImageCard from '../components/OnlineImageCard';
import Loading from '../components/Loading.js';
import axios from 'axios';

import { Masonry } from '@mui/lab';
import Switch from '@mui/material/Switch';

import Button from '../components/Button.js';

import { ReactComponent as SearchIcon } from '../assets/icon/search.svg';


function BrowseImage({ onClose, onSelectImage, title }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState(title || 'new');
  const [searchQuery, setSearchQuery] = useState('new');
  const PIXABAY_API_KEY = process.env.REACT_APP_PIXABAY_API_KEY;
  const [page, setPage] = useState(1); // Current page for pagination

  const [fullResolutionImage , setFullResolutionImage] = useState(false);

  const fetchImages = async () => {
    try {
      const encodedQuery = encodeURIComponent(searchQuery);
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: PIXABAY_API_KEY,
          q: encodedQuery,
          image_type: 'photo',
          page: page,
        },
      });
      setImages(response.data.hits);
      setPage(prevPage => prevPage + 1);
      console.log(response);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput); // Trigger search when clicking the button
    setPage(1); // Reset page for new search
    setImages([]); // Clear previous images
    setLoading(true);
  };

  const fetchMore = async () => {
    setLoading(true);
    try {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: PIXABAY_API_KEY,
          q: encodedQuery,
          image_type: 'photo',
          page: page,
        },
      });
      setImages((prevImages) => [...prevImages, ...response.data.hits]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSetting = () => {
    let fullResolutionImg = localStorage.getItem('fullResolutionImage');
    if (fullResolutionImg === null) {
      // If it doesn't exist, set it to 'false'
      localStorage.setItem('fullResolutionImage', 'false');
      fullResolutionImg = 'false';
    }else{
      setFullResolutionImage(fullResolutionImg === 'true');
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchUserSetting();
    setLoading(true);
    fetchImages();
  }, [searchQuery])

  const breakpointCols = {
    lg: 4,
    md: 3,
    sm: 2,
    xs: 1,
  };

  const handleImageSelect = (image) => {
    onSelectImage(image.largeImageURL , image.imageWidth , image.imageHeight); 
    onClose(); // Close the browse image modal
  };

  return (
    <div>
      <div className='browse-image-container'>
        <BackButton onClick={onClose} />
        <p className='browse-suggestion'>If you seek a specific treasure, let the search guide your way.</p>
        <div className='custom-search-box'>
          <SearchIcon className='search-icon'/>
          <input type="text" value={searchInput} onKeyDown={handleKeyDown} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search" className="mobile-search-input " />
        </div>
        <div className='switch-container'>
          <p className='browse-suggestion-2'>
            {fullResolutionImage 
              ? "The full splendor is now within your grasp, unbound by modesty."
              : "Be aware, these are but glimpses in modest quality. Rest assured, the full splendor awaits in high resolution."
            }
          </p>
          <Switch checked={fullResolutionImage} onChange={(e)=>{setFullResolutionImage(e.target.checked)}} inputProps={{ 'aria-label': 'controlled' }} />
        </div>
        
        {images?.length > 0 ? (
          <>
            {loading ? <Loading /> :
              <Masonry columns={breakpointCols} spacing={2}>
                {images.map((image) => (
                  <OnlineImageCard
                  key={image.id}
                  image={fullResolutionImage? image.largeImageURL : image.previewURL}
                  onSelect={() => handleImageSelect(image)}
                  />
                ))}
              </Masonry>
            }
            <Button onClick={fetchMore} text='More'/>
          </>
        ) : (
          <p>No images found.</p>
        )}
      </div>
    </div>
  );
}

export default BrowseImage;
