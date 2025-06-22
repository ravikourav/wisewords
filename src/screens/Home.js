import './css/Home.css';
import React, { useEffect, useState } from 'react';
import CardGrid from '../components/CardGrid';
import Loading from '../components/Loading';
import axios from 'axios';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCurrentColumnCount = () => {
    const width = window.innerWidth;
    if (width >= 1600) return 4;
    if (width >= 992) return 3;
    if (width >= 600) return 2;
    return 1;
  };

  const fetchData = async (concat = false) => {
    try {
      if(!concat)
      setLoading(true);

      const columns = getCurrentColumnCount();
      const desiredPostCount = 20;

      const remainder = desiredPostCount % columns;
      const adjustedLimit = remainder === 0 ? desiredPostCount : desiredPostCount + (columns - remainder);

      const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/post/random?limit=${adjustedLimit}`;
      const response = await axios.get(endPoint);
      const newData = concat ? [...data, ...response.data] : response.data;
      setData(newData);
      
      // Store data and scroll position
      sessionStorage.setItem('homeData', JSON.stringify(newData));

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedData = sessionStorage.getItem('homeData');

    if (savedData) {
      setData(JSON.parse(savedData));
      setLoading(false);

    } else {
      fetchData();
    }

     // Optional: clear cache on hard refresh
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('homeData');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
      <div className='page-root home-page-layout'>
        <div className='searchbar-header-container'>
          <SearchBar />
        </div>
        {loading ? <Loading /> : 
          <div className='home-data-container'>
            <CardGrid data={data} />
            <div className='paginate-container'>
              <Button text='More' onClick={()=>fetchData(true)} />
            </div>
          </div>
        }
      </div>
  );
}

export default Home;
