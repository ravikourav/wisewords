import React, { useState } from 'react';
import './css/SearchBar.css';

import { ReactComponent as SearchIcon } from '../assets/icon/search.svg';

const SearchBar = ({ onSearch , initialValue = '' }) => {
    const [query, setQuery] = useState(initialValue);

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(query);
        }
    }

    return (
        <div className='custom-search-box'>
            <SearchIcon className='search-icon'/>
            <input 
                type="text" 
                placeholder="Search" 
                value={query}  
                className="mobile-search-input" 
                onChange={handleChange} 
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default SearchBar;