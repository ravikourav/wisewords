import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ImageSearchContext = createContext();

export function ImageSearchProvider({ children }) {
  const API_KEY = process.env.REACT_APP_PIXABAY_API_KEY;
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('pixabay'); // default source

  const fetchFromPixabay = async ({ reset = false } = {}) => {
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: encodedQuery,
        image_type: 'photo',
        page: reset ? 1 : page,
      },
    });
    return response.data.hits;
  };

  const fetchImages = async ({ reset = false } = {}) => {
    setLoading(true);
    try {
      let newImages = [];

      if (source === 'pixabay') {
        newImages = await fetchFromPixabay({ reset });
      }
      // Add more source handlers here later

      if (reset) {
        setImages(newImages);
        setPage(2);
      } else {
        setImages((prev) => [...prev, ...newImages]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setImages([]);
  };

  useEffect(() => {
    if (searchQuery) {
      fetchImages({ reset: true });
    }
    // eslint-disable-next-line
  }, [searchQuery, source]);

  return (
    <ImageSearchContext.Provider
      value={{
        images,
        loading,
        fetchImages,
        resetSearch,
        setSearchQuery,
        searchQuery,
        setSource,
        source,
      }}
    >
      {children}
    </ImageSearchContext.Provider>
  );
}

export function useImageSearch() {
  return useContext(ImageSearchContext);
}
