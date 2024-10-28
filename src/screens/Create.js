import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import './css/Create.css';
import BrowseImage from './BrowseImage';
import Card from '../components/Card';
import axios from 'axios';
import Cookies from 'js-cookie';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Alert from '../components/Alert.js';

function Create() {
  const [loading , setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Quote');
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [contentColor, setContentColor] = useState('rgba(255, 255, 255, 1)');
  const [authorColor, setAuthorColor] = useState('rgba(255, 255, 255, 1)');
  const [tintColor, setTintColor] = useState('rgba(0, 0, 0, 0.4)');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [userAlert, setUserAlert] = useState({ message: '', type: '', visible: false });

  // Separate states for each color picker visibility
  const [activePicker, setActivePicker] = useState(null);

  const [browseOnline, setBrowseOnline] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        setBackgroundImage(file);
      } else {
        setUserAlert({ message: 'Please select a valid image file' , type: 'error', visible: true });
        e.target.value = '';
      }
    }
  };

  const handleColorChange = (color, setter) => {
    setter(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`);
  };

  const handleColorPickerClick = (picker) => {
    setActivePicker(activePicker === picker ? null : picker);
  };

  const handleImageSelect = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, { responseType: 'blob' });
      const file = new File([response.data], 'background.jpg', { type: response.data.type });
      setBackgroundImage(file);
    } catch (error) {
      console.error('Failed to download image', error);
      setUserAlert({ message: 'Failed to download image. Please try again.', type: 'error', visible: true });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !content || !author || !category || !tags.length || !backgroundImage) {
      setUserAlert({ message: 'Please fill in all fields.', type: 'error', visible: true });
      return;
    }
    setLoading(true);
    try {
      const token = Cookies.get('authToken');
      const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/post/create`;
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('author', author);
      formData.append('category', category);
      formData.append('tags', tags);
      formData.append('contentColor', contentColor);
      formData.append('authorColor', authorColor);
      formData.append('tintColor', tintColor);
      formData.append('backgroundImage', backgroundImage);
      await axios.post(endpoint, formData ,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setUserAlert({ message: 'Post created Successfully', type: 'success', visible: true });
      defaultCreateValues();
    } catch (error) {
      setLoading(false);
      console.error('Operation failed', error);
      setUserAlert({ message: 'Failed to create post. Please try again.', type: 'error', visible: true });
    }
  };

  const defaultCreateValues = () => {
    setTitle('');
    setContent('');
    setAuthor('');
    setCategory('Quote');
    setTags([]);
    setContentColor('rgba(255, 255, 255, 1)');
    setAuthorColor('rgba(255, 255, 255, 1)');
    setTintColor('rgba(0, 0, 0, 0.4)');
    setBackgroundImage(null);
    setLoading(false);
  }

  useEffect(() => {
    return () => {
      if (backgroundImage) {
        URL.revokeObjectURL(backgroundImage);
      }
    };
  }, [backgroundImage]);

  useEffect(()=>{
    featchTags();
  },[])

  const featchTags = async () =>{
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/tag/names`;
    try{
      const response = await axios.get(endpoint);
      setAllTags(response.data.names);
    }
    catch{
      setUserAlert({ message: 'Unable to featch tags.', type: 'error', visible: true });
    }
  }

  const closeOnlineImage = () =>{
    setBrowseOnline(false);
  }

  const handleCheckBox = () => {
    if(isAnonymous){
      setAuthor('');
    }
    else{
      setAuthor('Anonymous');
    }

    setIsAnonymous(!isAnonymous);
  }

  return (
    <div className='page-root'>
      { loading ? <Loading/> : 
      browseOnline ? (
        <BrowseImage onClose={closeOnlineImage} onSelectImage={handleImageSelect} title={title} />
      ) : (
        <div className='create-page'>
          {userAlert.visible &&
            <Alert
              message={userAlert.message}
              type={userAlert.type}
              duration={3000}
              visible={userAlert.visible}
              setVisible={(isVisible) => setUserAlert((prev) => ({ ...prev, visible: isVisible }))}
            />
          }
          <p className='create-page-title'>Create Post</p>
          <form onSubmit={handleSubmit} className='form-group'>
            <div className='img-container'>
              {backgroundImage ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' , alignItems: 'center'}}>
                  <Card
                    margin={true}
                    content={content}
                    textColor={contentColor}
                    author={author}
                    authorColor={authorColor}
                    background={URL.createObjectURL(backgroundImage)}
                    tint={tintColor}
                  />
                  <Button type='button' onClick={() =>{setBackgroundImage(null)}} width={150} text='Remove' />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input type='file' id='file-upload' className='file-input' onChange={handleImageChange} />
                  <label htmlFor="file-upload" className="file-input-label">Unveil Your Image</label>
                  <p className='pixels-button' onClick={() => setBrowseOnline(true)}>Explore Gallery</p>
                </div>
              )}
            </div>
            <div className='content-container'>
              <label>
                Title of Your Tale
                <input className='main-input input-title' type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label>
                The Essence of Your Creation
                <textarea className='main-input input-create-content' placeholder='Content' value={content} onChange={(e) => setContent(e.target.value)} />
              </label>
              <div className='multi-input-container'>
                <label>
                  Crafted By
                  <input className='main-input input-author' type='text' placeholder='Author' value={author} onChange={(e) => setAuthor(e.target.value)} disabled={isAnonymous} />
                </label>
                <label>
                  Embrace Anonymity
                  <input className='checkbox' type='checkbox' checked={isAnonymous} onChange={handleCheckBox} />
                </label>
              </div>
              <div className='multi-input-container'>
                <label>
                  Whispers of the Essence
                  <Autocomplete
                    className='autocomplete'
                    multiple
                    limitTags={2}
                    id="multiple-limit-tags"
                    options={allTags}
                    value={tags}
                    onChange={(event, newValue) => setTags(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Tag" />
                    )}
                  />
                </label>
                <label>
                  Realm of Creation
                  <select className='main-input category-input' value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value='quote'>Quote</option>
                    <option value='proverb'>Proverb</option>
                    <option value='poetry'>Poetry</option>
                    <option value='thought'>Thought</option>
                    <option value='haiku'>Haiku</option>
                    <option value='riddle'>Riddle</option>
                  </select>
                </label>
              </div>
              <div className='multi-input-container'>
                <label>
                  Shade of the Veil
                  <div className='color-container'>
                    <div className='main-input preview-color' style={{ backgroundColor: tintColor }}></div>
                    <Button onClick={() =>  handleColorPickerClick('tint')} text={activePicker==='tint' ? 'Apply' : 'Select'} selected={activePicker==='tint' ? true : false} type="button"/>
                  </div>
                  {activePicker==='tint' && (
                    <div >
                      <SketchPicker className='color-picker' color={tintColor} onChange={(color) => handleColorChange(color, setTintColor)} />
                    </div>
                  )}
                </label>
                <label>
                  Hue of the Heart
                  <div className='color-container'>
                    <div className='main-input preview-color' style={{ backgroundColor: contentColor }}></div>
                    <Button onClick={() => handleColorPickerClick('content')} text={activePicker==='content' ? 'Apply' : 'Select'} selected={activePicker==='content' ? true : false } type='button'/>
                  </div>
                  {activePicker==='content' && (
                    <div>
                      <SketchPicker className='color-picker' color={contentColor} onChange={(color) => handleColorChange(color, setContentColor)} />
                    </div>
                  )}
                </label>
                <label>
                  Tone of the Artisan
                  <div className='color-container'>
                    <div className='main-input preview-color' style={{ backgroundColor: authorColor }}></div>
                    <Button onClick={() => handleColorPickerClick('author')} text={activePicker==='author' ? 'Apply' : 'Select'} selected={activePicker==='author' ? true : false } type="button" />
                  </div>
                  {activePicker==='author' && (
                    <div>
                      <SketchPicker className='color-picker' color={authorColor} onChange={(color) => handleColorChange(color, setAuthorColor)} />
                    </div>
                  )}
                </label>
              </div>
              <Button type='submit' width={250} text='Create' align='center' />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Create;
