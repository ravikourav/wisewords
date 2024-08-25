import React, { useState, useEffect, useContext } from 'react';
import './css/Profile.css';
import { useParams } from 'react-router-dom';
import userImg from '../assets/icon/profile.png';
import CardGrid from '../components/CardGrid.js';
import { AuthContext } from '../hooks/AuthContext.js';
import axios from 'axios';
import Loading from '../components/Loading.js';

function Profile() {
    const { username } = useParams();
    const { logout, user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [postedData, setPostedData] = useState([]);
    const [saveCardData, setSaveCardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState('your-thought');

    const fetchData = async () => {
        try {
            setLoading(true);
            const endPoint = `/api/user/${username}`;
            const response = await axios.get(endPoint);
            setData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (username) {
            fetchData();
        }
    }, [username]);

    useEffect(() => {
        if (data) {
            setPostedData(data.posts || []);
            setSaveCardData(data.saved || []);
        }
    }, [data]);

    const selectContent = (select) => {
        setSelected(select);
    }

    const displayData = selected === 'your-thought' ? postedData : saveCardData;

    return (
        <>
            {loading ? ( <Loading/> ) : (
            <div className='profile-container'>
                {user.user.id === data._id && (
                    <button onClick={logout}>Logout</button>
                )}
                <img className='profile-img' src={userImg} alt='Profile' />
                {data && (
                    <>
                        <p className='user-name'>{data.name}</p>
                        <p className='user-id'>@{data.username}</p>
                        <div className='follow-container'>
                            <div>
                                <p className='user-data'>{data.posts.length}</p>
                                <p>Posts</p>
                            </div>
                            <div>
                                <p className='user-data'>{data.followers.length}</p>
                                <p>Followers</p>
                            </div>
                            <div>
                                <p className='user-data'>{data.following.length}</p>
                                <p>Following</p>
                            </div>
                        </div>
                    </>
                )}
                <div className='post-container'>
                    <div className='post-selector-container'>
                        <p className={`post-selector ${selected === 'your-thought' && 'post-selected'}`} onClick={() => selectContent('your-thought')}>Your Posts</p>
                        <p className={`post-selector ${selected === 'saved' && 'post-selected'}`} onClick={() => selectContent('saved')}>Saved</p>
                    </div>
                    <CardGrid data={displayData} />
                </div>
            </div>
            )}
        </>
    );
}

export default Profile;
