import React, { useState, useEffect } from 'react';
import './css/BrowseImage.css';
import BackButton from '../components/BackButton';
import OnlineImageCard from '../components/OnlineImageCard';
import { useSearchParams } from 'react-router-dom';
import Loading from '../components/Loading.js';
import axios from 'axios';

import { Masonry } from '@mui/lab';
import Switch from '@mui/material/Switch';

import Button from '../components/Button.js';

function BrowseImage({ onClose, onSelectImage, title }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const PIXABAY_API_KEY = process.env.REACT_APP_PIXABAY_API_KEY;
  const [page, setPage] = useState(1); // Current page for pagination

  const [fullResolutionImage , setFullResolutionImage] = useState(false);

  const fetchImages = async () => {
    if (!search && title) {
      setSearchParams({ search: title });
      return;
    }
    else if(!search && !title) {
      setSearchParams({ search: 'popular' });
      return;
    }

    try {
      const encodedQuery = encodeURIComponent(search.trim());
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
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMore = async () => {
    setLoading(true);
    setPage(page + 1);
    try {
      const encodedQuery = encodeURIComponent(search.trim());
      console.log('Encoded Query:', encodedQuery); // Debug logging
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: PIXABAY_API_KEY,
          q: encodedQuery,
          image_type: 'photo',
          page: page,
        },
      });
      setImages((prevImages) => [
        ...prevImages,
        ...response.data.hits,
      ]);
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

  useEffect(() => {
    fetchUserSetting();
    setLoading(true);
    fetchImages();
  }, [search]);

  const breakpointCols = {
    lg: 5,
    md: 4,
    sm: 3,
    xs: 2,
  };

  const handleImageSelect = (image) => {
    onSelectImage(image.largeImageURL , image.imageWidth , image.imageHeight); 
    onClose(); // Close the browse image modal
  };

  return (
    <div>
      <BackButton onClick={onClose} />
      <div className='browse-image-container'>
        <p className='browse-suggestion'>If you seek a specific treasure, let the search guide your way.</p>
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
