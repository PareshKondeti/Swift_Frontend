import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import DataGrid from './DataGrid';
import Pagination from './Pagination';
import './Dashboard.css';

const Dashboard = () => {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
    loadPersistedState();
  }, []);

  useEffect(() => {
    filterAndSortComments();
  }, [comments, searchTerm, sortConfig]);

  useEffect(() => {
    persistState();
  }, [searchTerm, currentPage, pageSize, sortConfig]);

  const fetchComments = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments');
      if (!response.ok) {
        throw new Error('failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const loadPersistedState = () => {
    const saved = localStorage.getItem('dashboardState');
    if (saved) {
      const state = JSON.parse(saved);
      setSearchTerm(state.searchTerm || '');
      setCurrentPage(state.currentPage || 1);
      setPageSize(state.pageSize || 10);
      setSortConfig(state.sortConfig || { key: null, direction: null });
    }
  };

  const persistState = () => {
    const state = {
      searchTerm,
      currentPage,
      pageSize,
      sortConfig
    };
    localStorage.setItem('dashboardState', JSON.stringify(state));
  };

  const filterAndSortComments = () => {
    let filtered = comments;

  
    if (searchTerm) {
      filtered = comments.filter(comment =>
        comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }


    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case 'postId':
            aValue = a.postId;
            bValue = b.postId;
            break;
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'email':
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredComments(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({ key: direction ? key : null, direction });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredComments.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredComments.length / pageSize);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading comments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Comments Dashboard</h1>
        <button onClick={handleProfileClick} className="profile-button">
          View Profile
        </button>
      </div>

      <div className="dashboard-controls">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <div className="results-info">
          Showing {getCurrentPageData().length} of {filteredComments.length} comments
        </div>
      </div>

      <DataGrid
        data={getCurrentPageData()}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredComments.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default Dashboard;