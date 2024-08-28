import React, { useState, useEffect, useContext } from 'react';
import './css/Profile.css';
import { useParams } from 'react-router-dom';
import CardGrid from '../components/CardGrid.js';
import { AuthContext } from '../hooks/AuthContext.js';
import axios from 'axios';
import Loading from '../components/Loading.js';

import Button from '../components/Button.js';
import IconButton from '../components/IconButton.js';

//icons
import { ReactComponent as ProfileIcon } from '../assets/icon/profile.svg';
import {ReactComponent as ShareIcon } from '../assets/icon/share.svg';
import Dropdown from '../components/Dropdown.js';
import ProfileSetting from '../components/ProfielSetting.js';

function Profile() {
    const { username } = useParams();
    const { logout, user, isLoggedIn } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [postedData, setPostedData] = useState([]);
    const [saveCardData, setSaveCardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState('your-thought');

    const [isOwner , setIsOwner] = useState(false);
    const [updateProfile , setUpdateProfile] = useState(false);
    const [isFollowing , setIsFollowing] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const endPoint = `/api/user/${username}`;
            const response = await axios.get(endPoint);
            setData(response.data);
            checkOwner(response.data._id);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkOwner = async (id) => {
        const endpoint = `/api/user/${id}/isfollowing`;
        if(user?.user.id === id){
            setIsOwner(true);
        }else{
            setIsOwner(false);
            try {
                const response = await axios.get(endpoint , {
                  withCredentials: true,
                });
                setIsFollowing(response.data.isfollowing);
              } catch (error) {
                console.error('Error fetching follow status:', error);
              }
        }
    }

    const followUnfollowOwner = async () => {
        const endpoint = isFollowing 
          ? `/api/user/${data._id}/unfollow` 
          : `/api/user/${data._id}/follow`;
      
        try {
            const response = await axios.post(endpoint, { 
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true 
            });
            console.log(response);
            if (response.status === 200) {
                setIsFollowing(!isFollowing);
            }
        } catch (error) {
          console.error('Error following/unfollowing user:', error);
        }
    };

    useEffect(() => {
        if (username) {
            fetchData();
        }
    }, [username , user]);

    useEffect(() => {
        if (data) {
            setPostedData(data.posts || []);
            setSaveCardData(data.saved || []);
        }
    }, [data]);

    const selectContent = (select) => {
        setSelected(select);
    }

    const handleShare = async (url) => {
        const encodedUrl = encodeURIComponent(url);

        if (navigator.share) {
            try {
                await navigator.share({
                url: encodedUrl,
                });
            } catch (error) {
                console.error('Error sharing content:', error);
            }
        } else {
        console.log('Web Share API is not supported in your browser.');
        }
    };

    const handleUpdateProfile = () => {
        setUpdateProfile(!updateProfile);
    }

    const displayData = selected === 'your-thought' ? postedData : saveCardData;

    return (
        <>
        {updateProfile ? 
            
            <ProfileSetting user={data} />

            :
            
            loading ? ( <Loading/> ) : (
            <div className='profile-container'>
                {data.coverImg && <img className='cover-img' src={data.coverImg} />
                }
                {data.avatar ?
                    <img src={data.avatar} alt='' className='profile-img' />
                :
                    <ProfileIcon fill='#ccc' className='profile-img' />
                }
                {data && (
                    <>
                        <p className='user-name'>{data.name}</p>
                        <p className='user-id'>@{data.username}</p>
                        <div className='follow-container'>
                            <div className='user-data-wraper'>
                                <p className='user-data'>{data.posts.length}</p>
                                <p>Posts</p>
                            </div>
                            <div className='user-data-wraper' >
                                <p className='user-data'>{data.followers.length}</p>
                                <p>Followers</p>
                            </div>
                            <div className='user-data-wraper' >
                                <p className='user-data'>{data.following.length}</p>
                                <p>Following</p>
                            </div>
                        </div>
                    </>
                )}
                {isOwner ? 
                    <div className='profile-control'>
                        <IconButton icon={ShareIcon} onClick={()=>handleShare(data.username)} size='25px'/>
                        <Button text='Logout' selected={true} onClick={logout} />
                        <Dropdown options={[{ label : 'Edit Profile' , onClick : handleUpdateProfile}]} />
                    </div> 
                    :
                    <div className='profile-control'>
                        <IconButton icon={ShareIcon} size='25px' onClick={handleShare}/>
                        <Button text={isFollowing ? 'Following' : 'Follow' } selected={isFollowing ? true : false} disabled= {!isLoggedIn} onClick={followUnfollowOwner} />    
                        <Dropdown options={[{ label : 'Report' ,onClick: () => console.log('Reported')}]} />
                    </div>
                }
                <div className='post-container'>
                    <div className='post-selector-container'>
                        <p className={`post-selector ${selected === 'your-thought' && 'post-selected'}`} onClick={() => selectContent('your-thought')}>{isOwner ? 'Your Posts' : 'Created'}</p>
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
