import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import videoService from '../services/videoService';
import VideoGrid from '../components/video/VideoGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { formatNumber } from '../utils/format';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'relevance',
    uploadDate: 'any',
    duration: 'any',
  });

  // Infinite scroll hook
  const { ref: loadMoreRef, isFetching } = useInfiniteScroll(
    () => loadMoreVideos(),
    hasMore
  );

  // Load videos when query or filters change
  useEffect(() => {
    if (query) {
      loadVideos(true);
    }
  }, [query, filters]);

  const loadVideos = async (reset = false) => {
    if (!query.trim()) return;

    try {
      setLoading(reset);
      setError(null);

      const params = {
        page: reset ? 1 : page,
        limit: 12,
        ...getSearchParams(),
      };

      const response = await videoService.searchVideos(query, params);
      
      if (response.success) {
        const newVideos = response.data.docs || [];
        
        if (reset) {
          setVideos(newVideos);
          setPage(2);
          setTotalResults(response.data.totalDocs || 0);
        } else {
          setVideos(prev => [...prev, ...newVideos]);
          setPage(prev => prev + 1);
        }

        setHasMore(response.data.hasNextPage || false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search videos');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreVideos = async () => {
    if (!hasMore || isFetching) return;
    await loadVideos(false);
  };

  const getSearchParams = () => {
    const params = {};
    
    if (filters.sortBy !== 'relevance') {
      if (filters.sortBy === 'upload_date') {
        params.sortBy = 'createdAt';
        params.sortType = 'desc';
      } else if (filters.sortBy === 'view_count') {
        params.sortBy = 'views';
        params.sortType = 'desc';
      }
    }
    
    // Add more filter logic here as needed
    
    return params;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
    setHasMore(true);
  };

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Search for videos
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter a search term to find videos
        </p>
      </div>
    );
  }

  if (loading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => loadVideos(true)}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Search results for "{query}"
          </h1>
          {totalResults > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatNumber(totalResults)} results
            </p>
          )}
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          icon={AdjustmentsHorizontalIcon}
        >
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card p-4 space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Filter Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort by
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input-field"
              >
                <option value="relevance">Relevance</option>
                <option value="upload_date">Upload date</option>
                <option value="view_count">View count</option>
              </select>
            </div>

            {/* Upload Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload date
              </label>
              <select
                value={filters.uploadDate}
                onChange={(e) => handleFilterChange('uploadDate', e.target.value)}
                className="input-field"
              >
                <option value="any">Any time</option>
                <option value="hour">Last hour</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="year">This year</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration
              </label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                className="input-field"
              >
                <option value="any">Any duration</option>
                <option value="short">Under 4 minutes</option>
                <option value="medium">4-20 minutes</option>
                <option value="long">Over 20 minutes</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Videos Grid */}
      <VideoGrid videos={videos} />

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isFetching && <LoadingSpinner size="md" />}
        </div>
      )}

      {/* No more videos message */}
      {!hasMore && videos.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            You've reached the end of search results
          </p>
        </div>
      )}

      {/* No videos found */}
      {videos.length === 0 && !loading && (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No results found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Try different keywords or remove search filters
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;