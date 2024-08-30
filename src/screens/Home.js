import './css/Home.css';
import React, { useEffect, useState } from 'react';
import CardGrid from '../components/CardGrid';
import Loading from '../components/Loading';
import axios from 'axios';

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
        setLoading(true);
        const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/post/all`;
        console.log("endpoint : ", endPoint);
        const response = await axios.get(endPoint);
        setData(response.data);
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
      </div>
  );
}

export default Home;
