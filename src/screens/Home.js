import './css/Home.css';
import React, { useEffect, useState } from 'react';
import CardGrid from '../components/CardGrid';
import Loading from '../components/Loading';
import axios from 'axios';
import Button from '../components/Button';

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (concat = false) => {
    try {
      setLoading(true);
      let scrollY = window.scrollY; 

      const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/post/random?limit=20`;
      const response = await axios.get(endPoint);
      setData(prevData => concat ? [...prevData, ...response.data] : response.data);
      console.log(response.data);
      
      setTimeout(() => window.scrollTo(0, scrollY), 100);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    loading ? <Loading /> : 
      <div className='home-page-layout'>
        <CardGrid data={data} />
        <div className='paginate-container'>
          <Button text='More' onClick={()=>fetchData(true)} />
        </div>
      </div>
  );
}

export default Home;
