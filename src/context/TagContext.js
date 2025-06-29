// context/TagContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAlert } from './AlertContext';

const TagContext = createContext();


export const useTags = () => useContext(TagContext);

export const TagProvider = ({ children }) => {
  const { showAlert } = useAlert();
  const [tags, setTags] = useState([]);
  const [tagsName , setTagsName] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [hasFetchedNames, setHasFetchedNames] = useState(false);

  const fetchTags = async () => {
    if (hasFetched) return; // already fetched
    setLoadingTags(true);
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/tag/all`;
    try {
      const response = await axios.get(endpoint);
      setTags(response.data);
      setHasFetched(true);
    } catch (err) {
      showAlert('Unable to Load Tags', 'error');
    } finally {
      setLoadingTags(false);
    }
  };

  const fetchTagsName = async () => {
    if (hasFetchedNames) return; // already fetched
    setLoadingTags(true);
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/tag/names`;
    try {
      const response = await axios.get(endpoint);
      setTagsName(response.data.names);
      setHasFetchedNames(true);
    } catch (err) {
      showAlert('Unable to Load Tags Name', 'error');
    } finally {
      setLoadingTags(false);
    }
  }

  useEffect(() => {
    fetchTags();
    fetchTagsName();
  }, []);

  return (
    <TagContext.Provider value={{ tags, tagsName, loadingTags, fetchTags }}>
      {children}
    </TagContext.Provider>
  );
};
