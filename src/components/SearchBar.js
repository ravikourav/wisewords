import React, { useState } from 'react';
import './css/SearchBar.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ReactComponent as SearchIcon } from '../assets/icon/search.svg';

const SearchBar = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('query') || '');

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            navigate(`/search?query=${encodeURIComponent(query)}`);
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