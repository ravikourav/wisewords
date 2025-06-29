// context/CategoryContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAlert } from './AlertContext';

const CategoryContext = createContext();

export const useCategories = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const { showAlert } = useAlert();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchCategories = async () => {
    if (hasFetched) return;
    setLoadingCategories(true);
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/category/all`; // Adjust path if different
    try {
      const response = await axios.get(endpoint);
      setCategories(response.data);
      setHasFetched(true);
    } catch (err) {
      showAlert('Unable to Load Categories', 'error');
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loadingCategories, fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

