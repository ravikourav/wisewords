import React, { useState, useEffect, useContext } from 'react';
import './css/Profile.css';
import userImg from '../assets/icon/profile.png';
import CardGrid from '../components/CardGrid.js';
import { AuthContext } from '../hooks/AuthContext.js';
import axios from 'axios';
import Loading from '../components/Loading.js';
import Cookies from 'js-cookie';

function Profile() {
    const { logout, user } = useContext(AuthContext);
    const [data, setData] = useState();
    const [postedData, setPostedData] = useState([]);
    const [saveCardData, setSaveCardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState('your-thought');

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = Cookies.get('authToken'); // Use localStorage
            const endPoint = `/api/user/${user.user.id}`; // Ensure the endpoint is correct
            const response = await axios.get(endPoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.user.id) {
            fetchData();
        }
    }, [user.user.id]); // Fetch data when user ID changes

    useEffect(() => {
        if (data) {
            setPostedData(data.posts);
            setSaveCardData(data.saved);
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
                <button onClick={logout}>Logout</button>
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
