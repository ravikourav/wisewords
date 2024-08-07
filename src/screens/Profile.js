import React, { useState , useEffect, useContext} from 'react';
import './css/Profile.css';
import userImg from '../assets/icon/profile.png';

import CardGrid from '../components/CardGrid.js';
import {  AuthContext } from '../hooks/AuthContext.js';

function Profile() {
    const {logout} = useContext(AuthContext);
    const [postedData, setPostedData] = useState([]);
    const [saveCardData, setSaveCardData] = useState([]);

    const [selected , setSelected] = useState('your-thought');

    useEffect(() => {
    }, []);

    const selectContent = (select) => {
        setSelected(select);
    }

    const displayData = selected === 'your-thought' ? postedData : saveCardData;

  return (
    <div className='profile-container'>
        <button onClick={logout} >Logout</button>
        <img className='profile-img' src={userImg} alt='' />
        <p className='user-name'>Ravi Kourav</p>
        <p className='user-id'>@ravikourav</p>

        <div className='follow-container'>
            <div>
                <p className='user-data'>5</p>
                <p>Post</p>
            </div>
            <div>
                <p className='user-data'>112</p>
                <p>follower</p>
            </div>
            <div>
                <p className='user-data'>5</p>
                <p>following</p>
            </div>
        </div>

        <div className='post-container'>
            <div className='post-selector-container'>
                <p className= {`post-selector ${ selected === "your-thought" && 'post-selected'}`} onClick={()=>{selectContent('your-thought')}}>Your Posts</p>
                <p className= {`post-selector ${ selected === "saved" && 'post-selected'}`} onClick={()=>{selectContent('saved')}}>Saved</p>
            </div>
            <CardGrid data={displayData}/>
        </div>
    </div>
  )
}

export default Profile;