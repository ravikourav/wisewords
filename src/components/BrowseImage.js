import React, { useState, useEffect } from 'react';
import './css/BrowseImage.css';
import BackButton from '../components/BackButton';
import OnlineImageCard from '../components/OnlineImageCard';
import Loading from '../components/Loading.js';
import { Masonry } from '@mui/lab';
import Switch from '@mui/material/Switch';
import Button from '../components/Button.js';
import { ReactComponent as SearchIcon } from '../assets/icon/search.svg';
import pixabayLogo from '../assets/other/pixabaylogo192.png'; 
import { useImageSearch } from '../context/ImageSearchContext.js';

function BrowseImage({ onClose, onSelectImage }) {
  const {
    images,
    loading,
    fetchImages,
    resetSearch,
    searchQuery,
  } = useImageSearch();
  const [searchInput, setSearchInput] = useState('');
  const [fullResolutionImage, setFullResolutionImage] = useState(false);

  // Handle Enter key press to trigger search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      resetSearch(searchInput); // this sets searchQuery and triggers fetch
    }
  };

  // Handle image selection
  const handleImageSelect = (image) => {
    onSelectImage(image.largeImageURL);
    onClose(); // Close the browse image modal
  };

  useEffect(() => {
    if (!searchQuery) {
      resetSearch('new');
    }else {
      setSearchInput(searchQuery === 'new' ? '' : searchQuery);
    }

    const savedSetting = localStorage.getItem('fullResolutionImage') === 'true';
    setFullResolutionImage(savedSetting);
    // eslint-disable-next-line
  }, []);
  
  const handleImgStateChange = (e) => {
    const newValue = e.target.checked;
    setFullResolutionImage(newValue);
    localStorage.setItem('fullResolutionImage', newValue);
  };

  const breakpointCols = {
    lg: 4,
    md: 3,
    sm: 2,
    xs: 1,
  };

  return (
    <div className='browse-image-container'>
      <div className='searchbar-header-container'>
        <BackButton onClick={onClose} />
        <div className='custom-search-box'>
          <SearchIcon className='search-icon' />
          <input
            type="text"
            value={searchInput}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search pixabay"
            className="mobile-search-input"
          />
        </div>
        <img src={pixabayLogo} alt='' className='search-source-logo' />
      </div>
      
      <div className='switch-container'>
        <p className='browse-suggestion-2'>Preview in high resolution</p>
        <Switch 
          checked={fullResolutionImage}
          onChange={(e) => {handleImgStateChange(e)}}
        />
      </div>
      {images?.length > 0 ? (
        <>
          <Masonry columns={breakpointCols} spacing={2}>
            {images.map((image) => (
              <OnlineImageCard
                key={image.id}
                image={fullResolutionImage ? image.largeImageURL : image.previewURL}
                onSelect={() => handleImageSelect(image)}
              />
            ))}
          </Masonry>
          {!loading && <Button onClick={() => fetchImages()} text='More' />}
          {loading && <Loading />}
        </>
        ) : (
          <div className='empty-state-container'>
            <p className='empty-state-message'>No images found.</p>
          </div>
        )
      }
    </div>
  );
}

export default BrowseImage;
