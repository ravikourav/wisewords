import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import './css/Create.css';
import BrowseImage from './BrowseImage';
import Card from '../components/Card';
import axios from 'axios';
import Cookies from 'js-cookie';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Dropdown from '../components/Dropdown';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import BackButton from '../components/BackButton';
import { useAlert } from '../context/AlertContext';
import { useTags } from '../context/TagContext';
import { useCategories } from '../context/CategoryContext';

function UpdatePost() {
  const { showAlert } = useAlert();
  const { categories } = useCategories();
  const { tagsName } = useTags();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Quote');
  const [selectedTags, setSelectedTags] = useState([]);
  const [contentColor, setContentColor] = useState('rgba(255, 255, 255, 1)');
  const [authorColor, setAuthorColor] = useState('rgba(255, 255, 255, 1)');
  const [tintColor, setTintColor] = useState('rgba(0, 0, 0, 0.4)');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);

  const [isAnonymous, setIsAnonymous] = useState(false);

  const [activePicker, setActivePicker] = useState(null);
  const [browseOnline, setBrowseOnline] = useState(false);

  useEffect(() => {
    fetchPostData();
  }, []);

  const fetchPostData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/post/${id}`);
      const post = response.data;
      setTitle(post.title);
      setContent(post.content);
      setAuthor(post.author);
      setCategory(post.category);
      setSelectedTags(post.tags);
      setContentColor(post.contentColor || 'rgba(255, 255, 255, 1)');
      setAuthorColor(post.authorColor || 'rgba(255, 255, 255, 1)');
      setTintColor(post.tintColor || 'rgba(0, 0, 0, 0.4)');
      setExistingImage(post.backgroundImage);
      setIsAnonymous(post.isAnonymous);
    } catch (error) {
      console.error('Failed to fetch post data', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        setBackgroundImage(file);
      } else {
        showAlert('Please select a valid image file', 'error');
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
      showAlert('Failed to download image. Please try again.' , 'error');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content || !author || !category || !selectedTags.length || (!backgroundImage && !existingImage)) {
      showAlert('Please fill in all fields.' , 'error');
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get('authToken');
      const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${id}`;
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('author', author);
      formData.append('category', category);
      formData.append('tags', selectedTags);
      formData.append('contentColor', contentColor);
      formData.append('authorColor', authorColor);
      formData.append('tintColor', tintColor);
      if (backgroundImage) {
        formData.append('backgroundImage', backgroundImage);
      }

      await axios.put(endpoint, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(-1);
      showAlert('Post updated successfully' , 'success');
    } catch (error) {
      showAlert('Failed to update post. Please try again.' , 'error');
    }
    finally {
      setLoading(false);
    }
  };

  const handleCheckBox = () => {
    if (isAnonymous) {
      setAuthor('');
    } else {
      setAuthor('Anonymous');
    }
    setIsAnonymous(!isAnonymous);
  };

  useEffect(()=> {
    console.log('cate : ' , category)
  },[category])

  return (
    loading ? <Loading /> :
    <div className='page-root'>
      {browseOnline ? (
        <BrowseImage onClose={() => setBrowseOnline(false)} onSelectImage={handleImageSelect} title={title} />
      ) : (
        <>
          <div className='create-page-header'>
            <BackButton onClick={()=>{navigate(-1)}}/>
            <p className='create-page-title'>Update Post</p>
          </div>
          <form onSubmit={handleSubmit} className='form-group'>
            <div className='img-container'>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Card
                    margin={true}
                    content={content}
                    textColor={contentColor}
                    author={author}
                    authorColor={authorColor}
                    background={backgroundImage ? URL.createObjectURL(backgroundImage) : existingImage}
                    tint={tintColor}
                  />
                  <input type='file' id='file-upload' className='file-input' onChange={handleImageChange} />
                  <Dropdown 
                    options={[
                      { 
                        label: 'Upload', 
                        onClick: () => {
                          setShowUploadDropdown(false);
                          document.getElementById('file-upload').click();
                        }
                      },
                      { 
                        label: 'Browse On Pixel', 
                        onClick: () => {
                          setBrowseOnline(true);
                          setShowUploadDropdown(false);
                        }
                      }
                    ]} 
                    showIcon={false} 
                    handleMenu={showUploadDropdown} 
                    menuPosition='top'
                  />
                  <Button type='button' onClick={() => setShowUploadDropdown(!showUploadDropdown) } width={250} text='Update Image'/>
                </div>
            </div>
            <div className='content-container'>
              <label>
                Title of Your Tale
                <input className='main-input input-title' type='text' placeholder='Title' value={title || ''} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label>
                The Essence of Your Creation
                <textarea className='main-input input-create-content' placeholder='Content' value={content || ''} onChange={(e) => setContent(e.target.value)} />
              </label>
              <div className='multi-input-container'>
                <label>
                  Crafted By
                  <input className='main-input input-author' type='text' placeholder='Author' value={author || ''} onChange={(e) => setAuthor(e.target.value)} disabled={isAnonymous} />
                </label>
                <label>
                  Embrace Anonymity
                  <input className='checkbox' type='checkbox' checked={isAnonymous || ''} onChange={handleCheckBox} />
                </label>
              </div>
              <div className='multi-input-container'>
                <label>
                  Whispers of the Essence
                  <Autocomplete
                    className='autocomplete'
                    multiple
                    limitTags={4}
                    id="multiple-limit-tags"
                    options={tagsName}
                    value={selectedTags}
                    onChange={(event, newValue) => setSelectedTags(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Tag" />
                    )}
                  />
                </label>
                <label>
                  Realm of Creation
                  <select 
                    className='main-input category-input' 
                    value={category} onChange={(e) => setCategory(e.target.value)}>
                      {categories.map((cat)=>(
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
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
              <Button type='submit' width={250} text='Update Post' align='center' />
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default UpdatePost;
