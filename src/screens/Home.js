import './css/Home.css';
import React, { useEffect, useState } from 'react';
import CardGrid from '../components/CardGrid';

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
  }, []);

  return (
    <div className='home-page-layout'>
      <CardGrid data={data} />
    </div>
  );
}

export default Home;
