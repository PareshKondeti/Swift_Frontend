import React from 'react';
import './DataGrid.css';

const DataGrid = ({ data, sortConfig, onSort }) => {
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return '↕️';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getSortClass = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return '';
    }
    return sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc';
  };

  return (
    <div className="data-grid-container">
      <div className="data-grid">
        <div className="grid-header">
          <div 
            className={`header-cell sortable ${getSortClass('postId')}`}
            onClick={() => onSort('postId')}
          >
            Post ID {getSortIcon('postId')}
          </div>
          <div 
            className={`header-cell sortable ${getSortClass('name')}`}
            onClick={() => onSort('name')}
          >
            Name {getSortIcon('name')}
          </div>
          <div 
            className={`header-cell sortable ${getSortClass('email')}`}
            onClick={() => onSort('email')}
          >
            Email {getSortIcon('email')}
          </div>
          <div className="header-cell">
            Comment
          </div>
        </div>
        
        {data.map((comment) => (
          <div key={comment.id} className="grid-row">
            <div className="grid-cell">{comment.postId}</div>
            <div className="grid-cell">{comment.name}</div>
            <div className="grid-cell">{comment.email}</div>
            <div className="grid-cell comment-cell">
              <div className="comment-text">{comment.body}</div>
            </div>
          </div>
        ))}
        
        {data.length === 0 && (
          <div className="no-data">
            No comments found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default DataGrid;