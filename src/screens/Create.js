import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import './css/Create.css';
import BrowseImage from './BrowseImage';
import Card from '../components/Card';
import axios from 'axios';
import Button from '../components/Button';
import Loading from '../components/Loading';

function Create() {
  const [loading , setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Quote');
  const [tags, setTags] = useState('test');
  const [contentColor, setContentColor] = useState('rgba(255, 255, 255, 1)');
  const [authorColor, setAuthorColor] = useState('rgba(255, 255, 255, 1)');
  const [tintColor, setTintColor] = useState('rgba(0, 0, 0, 0.4)');
  const [backgroundImage, setBackgroundImage] = useState(null);

  // Separate states for each color picker visibility
  const [showContentColorPicker, setShowContentColorPicker] = useState(false);
  const [showAuthorColorPicker, setShowAuthorColorPicker] = useState(false);
  const [showTintColorPicker, setShowTintColorPicker] = useState(false);

  const [browseOnline, setBrowseOnline] = useState(false);

  // Refs for color pickers
  const contentColorPickerRef = useRef(null);
  const authorColorPickerRef = useRef(null);
  const tintColorPickerRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setBackgroundImage(file);
      } else {
        alert('Please select a valid image file');
        e.target.value = '';
      }
    }
  };

  const handleColorChange = (color, setter) => {
    setter(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`);
  };

  const handleColorPickerClick = (picker) => {
    switch (picker) {
      case 'content':
        setShowContentColorPicker(!showContentColorPicker); 
        setShowAuthorColorPicker(false);
        setShowTintColorPicker(false);
        break;
      case 'author':
        setShowAuthorColorPicker(!showAuthorColorPicker);
        setShowContentColorPicker(false);
        setShowTintColorPicker(false);
        break;
      case 'tint':
        setShowTintColorPicker(!showTintColorPicker);
        setShowContentColorPicker(false);
        setShowAuthorColorPicker(false);
        break;
      default:
        break;
    }
  };

  const handleImageSelect = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, { responseType: 'blob' });
      const file = new File([response.data], 'background.jpg', { type: response.data.type });
      setBackgroundImage(file);
    } catch (error) {
      console.error('Failed to download image', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !content || !author || !category || !tags.length || !backgroundImage) {
      alert('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const endpoint = 'api/post/create';
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('author', author);
      formData.append('category', category);
      formData.append('tags', tags.split(',').map(tag => tag.trim()).join(','));
      formData.append('contentColor', contentColor);
      formData.append('authorColor', authorColor);
      formData.append('tintColor', tintColor);
      formData.append('backgroundImage', backgroundImage);

      await axios.post(endpoint, formData ,{
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      defaultCreateValues();
    } catch (error) {
      console.error('Operation failed', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const defaultCreateValues = () => {
    setTitle('');
    setContent('');
    setAuthor('');
    setCategory('Quote');
    setTags('');
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

  return (
    <div className='page-root'>
      {loading? <Loading/> : 
      browseOnline ? (
        <BrowseImage onClose={() => setBrowseOnline(false)} onSelectImage={handleImageSelect} title={title} />
      ) : (
        <>
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
                  <Button onClick={() =>{setBackgroundImage(null)}} width={150} text='Remove' />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input type='file' id='file-upload' className='file-input' onChange={handleImageChange} />
                  <label htmlFor="file-upload" className="file-input-label">Upload Image</label>
                  <p className='pixels-button' onClick={() => setBrowseOnline(true)}>Browse On Pixels</p>
                </div>
              )}
            </div>
            <div className='content-container'>
              <label>
                Title:
                <input className='main-input input-create' type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label>
                Content:
                <textarea className='main-input input-create-content' placeholder='Content' value={content} onChange={(e) => setContent(e.target.value)} />
              </label>
              <label>
                Author:
                <input className='main-input input-create' type='text' placeholder='Author' value={author} onChange={(e) => setAuthor(e.target.value)} />
              </label>
              <div className='category-tag-container'>
                <label>
                  Category:
                  <select className='main-input category-input' value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value='poem'>Poem</option>
                    <option value='quote'>Quote</option>
                    <option value='thought'>Thought</option>
                    <option value='haikyuu'>Haikyuu</option>
                  </select>
                </label>

                <label>
                  Tag:
                  <input className='main-input category-input' value={tags} onChange={(e) => setTags(e.target.value)}>
                  </input>
                </label>
              </div>
              <div className='color-container'>
                <label>
                  Tint Color:
                  <div className='color-container'>
                    <div className='main-input preview-color' style={{ backgroundColor: tintColor }}></div>
                    <p onClick={() =>  handleColorPickerClick('tint')} className='main-button button'>{showTintColorPicker ? 'Apply' : 'Select'}</p>
                  </div>
                  {showTintColorPicker && (
                    <div ref={tintColorPickerRef}>
                      <SketchPicker className='color-picker' color={tintColor} onChange={(color) => handleColorChange(color, setTintColor)} />
                    </div>
                  )}
                </label>
                <label>
                  Content Color:
                  <div className='color-container'>
                    <div className='main-input preview-color' style={{ backgroundColor: contentColor }}></div>
                    <p onClick={() => handleColorPickerClick('content')} className='main-button button'>{showContentColorPicker ? 'Apply' : 'Select'}</p>
                  </div>
                  {showContentColorPicker && (
                    <div ref={contentColorPickerRef}>
                      <SketchPicker className='color-picker' color={contentColor} onChange={(color) => handleColorChange(color, setContentColor)} />
                    </div>
                  )}
                </label>
                <label>
                  Author Color:
                  <div className='color-container'>
                    <div className='main-input preview-color' style={{ backgroundColor: authorColor }}></div>
                    <p onClick={() => handleColorPickerClick('author')} className='main-button button'>{showAuthorColorPicker ? 'Apply' : 'Select'}</p>
                  </div>
                  {showAuthorColorPicker && (
                    <div ref={authorColorPickerRef}>
                      <SketchPicker className='color-picker' color={authorColor} onChange={(color) => handleColorChange(color, setAuthorColor)} />
                    </div>
                  )}
                </label>
              </div>
              <Button type='submit' width={250} text='Create' align='center' />
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default Create;
