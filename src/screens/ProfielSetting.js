import React, { useEffect, useContext ,useState } from 'react';
import './css/ProfileSetting.css';
import Button from '../components/Button.js';
import axios from 'axios';
import BrowseImage from '../screens/BrowseImage.js';
import Loading from '../components/Loading.js';
import { AuthContext } from '../hooks/AuthContext.js';
import IconButton from '../components/IconButton.js';
import Dropdown from '../components/Dropdown.js';
import Cookies from 'js-cookie';

//Profile Icon
import { ReactComponent as ProfileIcon } from '../assets/icon/profile.svg';
import { ReactComponent as CloseImg } from '../assets/icon/close.svg';
import BackButton from '../components/BackButton.js';


function ProfileSetting({onClose}) {
  const { user } = useContext(AuthContext);
  const [data , setData] = useState();
  const [newProfile, setNewProfile] = useState(null);
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [bio, setBio] = useState('');
  const [name, setName] = useState('');

  const [loading , setLoading] = useState(false);
  const [browseOnline , setBrowseOnline] = useState(false);
  const [browseProfile , setBrowseProfile] = useState(false);
  const [removeProfile, setRemoveProfile] = useState(false);
  const [removeCover, setRemoveCover] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCoverDropdown, setShowCoverDropdown] = useState(false);
  
  const fetchData = async() => {
    setLoading(true);
    const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${user.username}`;
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

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setRemoveProfile(false);
        setNewProfile(file);
        setShowProfileDropdown(false);
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
        setRemoveProfile(false);
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
    const token = Cookies.get('authToken');
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${user._id}/update`;
    try { 
      const formData = new FormData();
      formData.append('name' , name);
      formData.append('bio', bio);

      if (removeProfile) {
        formData.append('removeProfile', removeProfile);
      } else if (newProfile) {
        formData.append('profile', newProfile);
      }

      if (removeCover) {
        formData.append('removeCoverImg', removeCover);
      } else if (newCoverImage) {
        formData.append('coverImg', newCoverImage);
      }

      await axios.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
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
      const file = new File([response.data], browseProfile ? 'profile.jpg' : 'cover.jpg', { type: response.data.type });
      if(browseProfile){
        setRemoveProfile(false);
        setNewProfile(file);
      }else{
        setRemoveCover(false);
        setNewCoverImage(file);
      }
    } catch (error) {
      console.error('Failed to download image', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const removeProfileImage = () => {
    setNewProfile(null);
    setRemoveProfile(true);
    setData((prevData) => ({ ...prevData, profile: '' }));
};

const removeCoverImage = () => {
    setNewCoverImage(null);
    setRemoveCover(true);
    setData((prevData) => ({ ...prevData, coverImg: '' }));
};

  return (
    <>
      {browseOnline ? (
        <BrowseImage onClose={closeOnlineImage} onSelectImage={handleImageSelect} />
      ) : (
        <>
          <div className='update-page-header'>
            <BackButton onClick={onClose} />
            <p className='update-page-title'>Edit Profile</p>
          </div>
          { loading ? <Loading height='65vh'/> : (
            <form className='form-group-profile' onSubmit={handleSubmit}>
              <div className='profile-img-container'>
                <div className='cover-container'>
                  {data?.coverImg || newCoverImage ? 
                    <>
                      <img className='cover-img' src={newCoverImage ? URL.createObjectURL(newCoverImage) : data?.coverImg} alt='' />
                      <IconButton className='close-button remove-cover-button' icon={CloseImg} onClick={removeCoverImage} size={30} type='button'/>
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
                                setBrowseProfile(false);
                                setShowCoverDropdown(false);
                              }
                            }
                          ]} 
                          showIcon={false} 
                          handleMenu={showCoverDropdown} 
                          menuPosition='bottom'
                        />
                      </div>
                    </>
                  }
                </div>
                <div className='edit-profile-img-container'>
                  {data?.profile || newProfile  ?
                    <>
                      <img src={newProfile ? URL.createObjectURL(newProfile) : data?.profile} alt='' className='profile-img' />
                      <IconButton className='close-button remove-profile-button' size='20px' icon={CloseImg} onClick={removeProfileImage} type='button'/>
                    </>
                    :
                    <div className='edit-profile-img-container'>
                      <ProfileIcon fill={`${!showProfileDropdown? '#ccc' : '#a3a3a3'}`} className='profile-img img-template' onClick={()=>setShowProfileDropdown(!showProfileDropdown)} />
                      <input type='file' id='profile-image-upload' className='file-input' onChange={handleProfileChange} />
                      <Dropdown 
                        showIcon={false} 
                        options={[
                          { 
                            label: 'Upload', 
                            onClick: () => {
                              setShowProfileDropdown(false);
                              document.getElementById('profile-image-upload').click(); // Trigger the file input
                            }
                          },
                          { 
                            label: 'Browse On Pixel', 
                            onClick: () => {
                              setBrowseOnline(true);
                              setBrowseProfile(true);
                              setShowProfileDropdown(false);
                            }
                          }
                        ]} 
                        handleMenu={showProfileDropdown} 
                        menuPosition='bottom'
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
          )}
        </>
      )}
    </>
  );
}

export default ProfileSetting;
