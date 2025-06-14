import React, { useState, useEffect } from 'react';
import './css/BrowseImage.css';
import BackButton from '../components/BackButton';
import OnlineImageCard from '../components/OnlineImageCard';
import Loading from '../components/Loading.js';
import axios from 'axios';
import { Masonry } from '@mui/lab';
import Switch from '@mui/material/Switch';
import Button from '../components/Button.js';
import Alert from '../components/Alert.js';
import { ReactComponent as SearchIcon } from '../assets/icon/search.svg';
import pixabayLogo from '../assets/other/pixabaylogo192.png'; 

function BrowseImage({ onClose, onSelectImage, title }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(title || '');
  const [searchQuery, setSearchQuery] = useState('');
  const PIXABAY_API_KEY = process.env.REACT_APP_PIXABAY_API_KEY;
  const [page, setPage] = useState(1); // Current page for pagination
  const [fullResolutionImage, setFullResolutionImage] = useState(false);

  const [userAlert, setUserAlert] = useState({ message: '', type: '', visible: false });

  // Handle search submission
  const handleSearch = () => {
    setSearchQuery(searchInput); // Update search query
    setPage(1); // Reset page to 1 for a new search
    setImages([]); // Clear previous images
    setLoading(true); // Set loading state
  };

  // Fetch images from Pixabay API
  const fetchImages = async (reset = false) => {
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
      if (reset) {
        setImages(response.data.hits); // Reset images on a new search
      } else {
        setImages((prevImages) => [...prevImages, ...response.data.hits]); // Append images for pagination
      }
      setPage((prevPage) => prevPage + 1); // Increment page number
    } catch (error) {
      setUserAlert({ message: 'Error fetching images' , type: 'error', visible: true });
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press to trigger search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Fetch images when the component mounts and when searchQuery changes
  useEffect(() => {
    fetchImages(true); // Fetch images for new search (reset is true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]); // Fetch images only when the search query changes

  // Handle image selection
  const handleImageSelect = (image) => {
    onSelectImage(image.largeImageURL);
    onClose(); // Close the browse image modal
  };

  useEffect(() => {
    const savedSetting = localStorage.getItem('fullResolutionImage') === 'true';
    setFullResolutionImage(savedSetting);
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
      {userAlert.visible &&
        <Alert
          message={userAlert.message}
          type={userAlert.type}
          duration={3000}
          visible={userAlert.visible}
          setVisible={(isVisible) => setUserAlert((prev) => ({ ...prev, visible: isVisible }))}
        />
      }
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
        <p className='browse-suggestion-2'>
          {fullResolutionImage
            ? "The veil is lifted behold every detail in its finest truth."
            : "The full splendor awaits in high resolution."
          }
        </p>
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
