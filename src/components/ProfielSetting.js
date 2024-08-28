import React, { useState } from 'react';
import './css/ProfileSetting.css';
import Button from '../components/Button.js';
import axios from 'axios';
import BrowseImage from '../screens/BrowseImage.js';
import Loading from './Loading.js';

//Profile Icon
import { ReactComponent as ProfileIcon } from '../assets/icon/profile.svg';

function ProfileSetting({ user }) {
  const [data , setData] = useState(user);
  const [newAvatar, setNewAvatar] = useState(null);
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [bio, setBio] = useState(user.bio || '');
  const [username, setUsername] = useState(user.username || '');
  const [name, setName] = useState(user.name || '');

  const [loading , setLoading] = useState(false);
  const [browseOnline , setBrowseOnline] = useState(false);
  const [browseAvatar , setBrowseAvatar] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setNewAvatar(file);
      } else {
        alert('Please select a valid image file');
        e.target.value = '';
      }
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setNewCoverImage(file);
      } else {
        alert('Please select a valid image file');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = `/api/user/${user._id}/update`;
    try { 
      const formData = new FormData();
      formData.append('name' , name);
      formData.append('bio', bio);
      // Only append files if they exist
      if (newAvatar) {
        formData.append('avatar', newAvatar);
      }

      if (newCoverImage) {
        formData.append('coverImg', newCoverImage);
      }

      // Log the FormData to check its contents
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.put(endpoint, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log(response.data.user);
      setLoading(false);

    }catch (err){
      console.log('cant not update profile');
      setLoading(false);
    }
  };

  const closeOnlineImage = () =>{
    setBrowseOnline(false);
  }

  const handleImageSelect = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, { responseType: 'blob' });
      const file = new File([response.data], browseAvatar ? 'avatar.jpg' : 'cover.jpg', { type: response.data.type });
      if(browseAvatar){
        setNewAvatar(file);
      }else{
        setNewCoverImage(file);
      }
    } catch (error) {
      console.error('Failed to download image', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const removeAvatar = () => {
    setNewAvatar(null);
    setData((prevData) => ({ ...prevData, avatar: '' }));
  };

  const removeCoverImage = () => {
    setNewCoverImage(null);
    setData((prevData) => ({ ...prevData, coverImage: '' }));
  };

  return (
    <div className="page-root">
      { loading ? <Loading/> :
      browseOnline ? (
        <BrowseImage onClose={closeOnlineImage} onSelectImage={handleImageSelect} />
      ) : (
        <>
          <p className='create-page-title'>Edit Profile</p>
          <form className='form-group-profile' onSubmit={handleSubmit}>
              {data.coverImg || newCoverImage ? 
                <>
                  <img className='cover-img' src={newCoverImage ? URL.createObjectURL(newCoverImage) : data.coverImg} alt='' />
                  <Button onClick={removeCoverImage} width={120} text='Remove' />
                </>
                :
                <>
                  <label htmlFor="cover-image-upload"  className="cover-input-label">Unveil Your Cover</label>
                  <input type='file' accept="image/*" id='cover-image-upload' className='file-input' onChange={handleCoverImageChange} />
                  <p className='pixels-button' onClick={() => {setBrowseOnline(true); setBrowseAvatar(false)}}>Explore the Pixel Gallery</p>
                </>
              }
            <div className='edit-profile-img-container'>
              {data.avatar || newAvatar  ?
                <>
                  <img src={newAvatar ? URL.createObjectURL(newAvatar) : data.avatar} alt='' className='profile-img' />
                  <Button onClick={removeAvatar} width={120} text='Remove' />
                </>
                :
                <div className='edit-profile-img-container'>
                  <label htmlFor="avatar-image-upload">
                    <ProfileIcon htmlFor="avatar-image-upload" fill='#ccc' className='profile-img' />
                  </label>
                  <input type='file' id='avatar-image-upload' className='file-input' onChange={handleAvatarChange} />
                  <p className='pixels-button' onClick={() => {setBrowseOnline(true); setBrowseAvatar(true)}}>Explore the Pixel Gallery</p>
                </div>
              }
            </div>
            <div className='content-container'>
              <label>Name</label>
              <input 
                type="text" 
                className='main-input input-create'
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='content-container'>
              <label>Username</label>
              <input 
                type="text" 
                className='main-input input-create'
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='content-container'>
              <label>Bio</label>
              <textarea 
                className='main-input input-create-content' 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <Button text='Update' type="submit">Update Profile</Button>
          </form>
        </>
      )}
    </div>
  );
}

export default ProfileSetting;
