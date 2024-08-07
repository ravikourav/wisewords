import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import './css/Create.css';

function Create() {

  const [contentColor, setContentColor] = useState('rgba(255, 255, 255, 1)');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const [tags , setTags] = useState();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(()=>{
    
  },[]);

  const handleContentColorChange = (color) => {
    setContentColor(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`);
  };

  const handleColorPickerClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  return (
    <div>
      <p className='create-page-title'>Create Post</p>
      <div className='form-group'>
        
        <div className='img-container'>
          {backgroundImage ? (
            <img src={backgroundImage} alt='Uploaded Background' className='uploaded-image' />
          ) : (
            <input type='file' onChange={handleImageChange} />
          )}
        </div>

        <div className='content-container'>
          <label>
            Content:
            <input className='main-input input-create' type='text' placeholder='Title' />
          </label>
          <label>
            Content:
            <textarea className='main-input input-create-content' type='text' placeholder='Content' />
          </label>
          <label>
            Author:
            <input className='main-input input-create' type='text' placeholder='Author' />
          </label>
          <div className='category-color-container color-container'>
            <label>
              Category:
              <select className='main-input category-input'>
                <option value='poem'>Poem</option>
                <option value='quote'>Quote</option>
                <option value='thought'>Thought</option>
                <option value='haikyuu'>Haikyuu</option>
              </select>
            </label>

            <label>
              Tag:
              <select className='main-input category-input'>
                {tags && tags.map((tag)=>(
                  <option value={tag.name}>{tag.name}</option>
                ))}
              </select>
            </label>

            <label>
              Text color on Img :
              <div className='color-container'>
                <div className='main-input preview-color' style={{ backgroundColor: contentColor }}></div>
                <p onClick={handleColorPickerClick} className='main-button button'>{displayColorPicker? 'Apply' : 'Select'}</p>
              </div>
              {displayColorPicker && (<>
                <SketchPicker className='color-picker' color={contentColor} onChange={handleContentColorChange} />
              </>
              )}
            </label>
          </div>
          <button type='submit' className='main-button submit-post'>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Create;
