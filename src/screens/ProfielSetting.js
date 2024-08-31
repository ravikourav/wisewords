import React, { useEffect, useContext ,useState } from 'react';
import './css/ProfileSetting.css';
import Button from '../components/Button.js';
import axios from 'axios';
import BrowseImage from '../screens/BrowseImage.js';
import Loading from '../components/Loading.js';
import { AuthContext } from '../hooks/AuthContext.js';
import IconButton from '../components/IconButton.js';
import Dropdown from '../components/Dropdown.js';

//Profile Icon
import { ReactComponent as ProfileIcon } from '../assets/icon/profile.svg';
import { ReactComponent as CloseImg } from '../assets/icon/close.svg';


function ProfileSetting() {
  const { user } = useContext(AuthContext);
  const [data , setData] = useState();
  const [newAvatar, setNewAvatar] = useState(null);
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [bio, setBio] = useState('');
  const [name, setName] = useState('');

  const [loading , setLoading] = useState(false);
  const [browseOnline , setBrowseOnline] = useState(false);
  const [browseAvatar , setBrowseAvatar] = useState(false);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [removeCover, setRemoveCover] = useState(false);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [showCoverDropdown, setShowCoverDropdown] = useState(false);
  
  const fetchData = async() => {
    setLoading(true);
    const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${user.user.username}`;
    try{
      const response = await axios.get(endPoint);
      setData(response.data);
      setName(response.data.name);
      setBio(response.data.bio);
      setLoading(false);
    }
    catch{
      console.log('unable to featch user data');
    }
  }
  
  useEffect(()=>{
    fetchData();
  },[])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setRemoveAvatar(false);
        setNewAvatar(file);
        setShowAvatarDropdown(false);
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
        setRemoveAvatar(false);
        setNewCoverImage(file);
        setShowCoverDropdown(false);
      } else {
        alert('Please select a valid image file');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${user.user.id}/update`;
    try { 
      const formData = new FormData();
      formData.append('name' , name);
      formData.append('bio', bio);

      if (removeAvatar) {
        formData.append('removeAvatar', removeAvatar);
      } else if (newAvatar) {
        formData.append('avatar', newAvatar);
      }

      if (removeCover) {
        formData.append('removeCoverImg', removeCover);
      } else if (newCoverImage) {
        formData.append('coverImg', newCoverImage);
      }

      await axios.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }); 
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
        setRemoveAvatar(false);
        setNewAvatar(file);
      }else{
        setRemoveCover(false);
        setNewCoverImage(file);
      }
    } catch (error) {
      console.error('Failed to download image', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const removeAvatarImage = () => {
    setNewAvatar(null);
    setRemoveAvatar(true);
    setData((prevData) => ({ ...prevData, avatar: '' }));
};

const removeCoverImage = () => {
    setNewCoverImage(null);
    setRemoveCover(true);
    setData((prevData) => ({ ...prevData, coverImg: '' }));
};

  return (
    <div className="page-root">
      { loading ? <Loading/> :
      browseOnline ? (
        <BrowseImage onClose={closeOnlineImage} onSelectImage={handleImageSelect} />
      ) : (
        <div>
          <p className='update-page-title'>Edit Profile</p>
          <form className='form-group-profile' onSubmit={handleSubmit}>
            <div className='profile-img-container'>
              <div className='cover-container'>
                {data?.coverImg || newCoverImage ? 
                  <>
                    <img className='cover-img' src={newCoverImage ? URL.createObjectURL(newCoverImage) : data?.coverImg} alt='' />
                    <IconButton className='close-button remove-cover-button' icon={CloseImg} onClick={removeCoverImage} type='button'/>
                  </>
                  :
                  <>
                    <label className="cover-input-label" style={{backgroundColor: `${!showCoverDropdown? '#f1f1f1' : '#a3a3a3' }`}} onClick={()=>setShowCoverDropdown(!showCoverDropdown)}>Unveil Your Cover</label>
                    <input type='file' accept="image/*" id='cover-image-upload' className='file-input' onChange={handleCoverImageChange} />
                    <div className='img-upload-dropdown'>
                      <Dropdown 
                        options={[
                          { 
                            label: 'Upload', 
                            onClick: () => {
                              setShowCoverDropdown(false);
                              document.getElementById('cover-image-upload').click(); // Trigger the file input
                            }
                          },
                          { 
                            label: 'Browse On Pixel', 
                            onClick: () => {
                              setBrowseOnline(true);
                              setBrowseAvatar(false);
                              setShowCoverDropdown(false);
                            }
                          }
                        ]} 
                        showIcon={false} 
                        handleMenu={showCoverDropdown} 
                      />
                    </div>
                  </>
                }
              </div>
              <div className='edit-profile-img-container'>
                {data?.avatar || newAvatar  ?
                  <>
                    <img src={newAvatar ? URL.createObjectURL(newAvatar) : data?.avatar} alt='' className='profile-img' />
                    <IconButton className='close-button remove-avatar-button' size='20px' icon={CloseImg} onClick={removeAvatarImage} type='button'/>
                  </>
                  :
                  <div className='edit-profile-img-container'>
                    <ProfileIcon fill={`${!showAvatarDropdown? '#ccc' : '#a3a3a3'}`} className='profile-img img-template' onClick={()=>setShowAvatarDropdown(!showAvatarDropdown)} />
                    <input type='file' id='avatar-image-upload' className='file-input' onChange={handleAvatarChange} />
                    <Dropdown 
                      showIcon={false} 
                      options={[
                        { 
                          label: 'Upload', 
                          onClick: () => {
                            setShowAvatarDropdown(false);
                            document.getElementById('avatar-image-upload').click(); // Trigger the file input
                          }
                        },
                        { 
                          label: 'Browse On Pixel', 
                          onClick: () => {
                            setBrowseOnline(true);
                            setBrowseAvatar(true);
                            setShowAvatarDropdown(false);
                          }
                        }
                      ]} 
                      handleMenu={showAvatarDropdown} 
                    />
                  </div>
                }
              </div>
            </div>
            <div className='content-container'>
              <label>Name</label>
              <input 
                type="text" 
                className='main-input input-title'
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='content-container'>
              <label>Bio</label>
              <textarea 
                className='main-input input-create-content' 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
              />
              <p>{bio.length}/160</p>
            </div>
            <Button text='Update' type="submit">Update Profile</Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProfileSetting;
