import React, { useState, useEffect, useContext } from 'react';
import './css/Profile.css';
import { useParams } from 'react-router-dom';
import CardGrid from '../components/CardGrid.js';
import { AuthContext } from '../hooks/AuthContext.js';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loading from '../components/Loading.js';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.js';
import IconButton from '../components/IconButton.js';
import Badge from '../components/Badge.js';
import BackButton from '../components/BackButton.js';

//icons
import { ReactComponent as ProfileIcon } from '../assets/icon/profile.svg';
import {ReactComponent as ShareIcon } from '../assets/icon/share.svg';
import Dropdown from '../components/Dropdown.js';

function Profile() {
    const navigate = useNavigate();
    const { username } = useParams();
    const { logout, user, isLoggedIn} = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [postedData, setPostedData] = useState([]);
    const [saveCardData, setSaveCardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState('your-thought');
    const [tab, setTab] = useState('home');
    const [followerUsers, setFollowerUsers] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);


    const [isOwner , setIsOwner] = useState(false);
    const [isFollowing , setIsFollowing] = useState(null);

    const followUnfollowOwner = async () => {
        const token = Cookies.get('authToken');
        const endpoint = isFollowing 
          ? `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${data._id}/unfollow` 
          : `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${data._id}/follow`;
      
        try {
            const response = await axios.post(endpoint,{}, { 
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setIsFollowing(!isFollowing);
            }
        } catch (error) {
          console.error('Error following/unfollowing user:', error);
        }
    };

    useEffect(() => {
        const checkOwner = (id) => {
            if(user?._id === id){
                setIsOwner(true);
            }else{
                setIsOwner(false);
                setIsFollowing(user?.following.includes(id));
            }
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${username}`;
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

        if (username) {
            fetchData();
        }
    }, [username, user ]);

    useEffect(() => {
        if (data) {
            setPostedData(data.posts || []);
            setSaveCardData(data.saved || []);
        }
    }, [data]);

    useEffect(() => {
        const fetchUserList = async (setter) => {
            try {
                const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${data._id}/${tab}`;
                const response = await axios.get(endPoint);
                setter(response.data);
                console.log(`${tab} users:`, response.data);
            } catch (error) {
                console.error('Error fetching user list:', error);
            }
        };

        if (tab === 'followers' && data?.followers?.length > 0) {
            fetchUserList(setFollowerUsers);
        }

        if (tab === 'following' && data?.following?.length > 0) {
            fetchUserList(setFollowingUsers);
        }
    }, [tab, data]);

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

    const handleProfileClick = (username) => {
        navigate(`/user/${username}`);
        setTab('home');
    };


    const displayData = selected === 'your-thought' ? postedData : saveCardData;

    return (
        <div className='page-root'>
            {loading ? ( <Loading/> ) : 
                (
                    <>
                    {tab === 'home' && (
                        <div className='profile-page'>
                            <div className='profile-img-container'>
                                {data.coverImg && <img className='cover-img' src={data.coverImg} alt=''/>
                                }
                                {data.profile ?
                                    <img src={data.profile} alt='' className='profile-img' />
                                :
                                    <ProfileIcon fill='#ccc' className='profile-img' />
                                }
                            </div>
                            {data && (
                                <div className='user-profile-info'>
                                    <p className='user-name'>{data.name} <Badge badge={data.badge} size={26}/></p>
                                    <p className='user-bio'>{data.bio}</p>
                                    <p className='user-id'>@{data.username}</p>
                                    <div className='follow-container'>
                                        <div className='user-data-wrapper'>
                                            <p className='user-data'>{data.posts.length}</p>
                                            <p className='user-data-label'>Posts</p>
                                        </div>
                                        <div className='user-data-wrapper' onClick={() => setTab('followers')} >
                                            <p className='user-data'>{data.followers.length}</p>
                                            <p className='user-data-label'>Followers</p>
                                        </div>
                                        <div className='user-data-wrapper' onClick={() => setTab('following')} >
                                            <p className='user-data'>{data.following.length}</p>
                                            <p className='user-data-label'>Following</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {isOwner ? 
                                <div className='profile-control'>
                                    <div className='control-button'>
                                        <IconButton icon={ShareIcon} onClick={()=>handleShare(data.username)} size='25px'/>
                                    </div>
                                    <div className='control-button'>
                                        <Button text='Logout' selected={true} onClick={logout} />
                                    </div>
                                    <div className='control-button'>
                                        <Dropdown showIcon={true} options={[{ label : 'Edit Profile' , onClick : () => navigate('/editUser') }]} menuPosition='top-right'/>
                                    </div>
                                </div> 
                                :
                                <div className='profile-control'>
                                    <div className='control-button'>
                                        <IconButton icon={ShareIcon} size='25px' onClick={handleShare}/>
                                    </div>
                                    <div className='control-button'>
                                        <Button text={isFollowing ? 'Following' : 'Follow' } selected={isFollowing ? true : false} disabled= {!isLoggedIn} onClick={followUnfollowOwner} /> 
                                    </div>   
                                    <div className='control-button'>
                                        <Dropdown showIcon={true} options={[{ label : 'Report' , onClick : () => console.log('Reported')}]} />
                                    </div>
                                </div>
                            }
                            <div className='post-selector-container'>
                                <p className={`post-selector ${selected === 'your-thought' && 'post-selected'}`} onClick={() => selectContent('your-thought')}>{isOwner ? 'Your Posts' : 'Created'}</p>
                                <p className={`post-selector ${selected === 'saved' && 'post-selected'}`} onClick={() => selectContent('saved')}>Saved</p>
                            </div>
                            <CardGrid data={displayData} />
                        </div>
                    )}
                    {tab === 'followers' && (
                        <>
                            <div className='pannel-header' onClick={() => setTab('home')}>
                                <BackButton onClick={() => setTab('home')} />
                                <h2 className='pannel-title'>Followers</h2>
                            </div>
                            <div className='followers-container'>
                                {/* Followers List */}
                                {followerUsers.length > 0 ? (
                                    <div className='user-list'>
                                        {followerUsers.map((user) => (
                                            <div key={user._id} className='user-card' onClick={()=>handleProfileClick(user.username)} >
                                                {user.profile ?
                                                <img src={user.profile} alt={`${user.name}'s profile`} className='ff-profile-img' />
                                                :
                                                <ProfileIcon fill='#ccc' className='ff-profile-img' />
                                                }
                                                <div className='ff-user-info'>
                                                    <h3 className='ff-user-name'>{user.name} <Badge badge={user.badge} size={26}/></h3>
                                                    <h3 className='ff-user-username'>@{user.username}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='empty-state-container'>
                                        <p className='empty-state-message'>Even the wisest voices begin in silence.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {tab === 'following' && (
                        <>
                            <div className='pannel-header' onClick={() => setTab('home')}>
                                <BackButton  onClick={() => setTab('home')}/>
                                <h2 className='pannel-title' >Following</h2>
                            </div>
                            
                            <div className='following-container'>
                                {/* Following List */}
                                {followingUsers.length > 0 ? (
                                    <div className='user-list'>{
                                        followingUsers.map((user) => (
                                        <div key={user._id} className='user-card' onClick={()=>handleProfileClick(user.username)} >
                                            {user.profile ?
                                            <img src={user.profile} alt={`${user.name}'s profile`} className='ff-profile-img' />
                                            :
                                            <ProfileIcon fill='#ccc' className='ff-profile-img' />
                                            }
                                            <div className='ff-user-info'>
                                                <h3 className='ff-user-name'>{user.name} <Badge badge={user.badge} size={26}/></h3>
                                                <h3 className='ff-user-username'>@{user.username}</h3>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='empty-state-container'>
                                        <p className='empty-state-message'>Your path is empty — find voices worth hearing.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    </>
                )
            }
        </div>
    );
}

export default Profile;
