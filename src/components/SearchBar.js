import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearch }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search by name, email, or phone..."
          className="search-input"
        />
        <div className="search-icon">🔍</div>
      </div>
    </div>
  );
};

export default SearchBar;