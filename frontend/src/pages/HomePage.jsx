import React, { useState, useEffect } from 'react';
import { VIDEO_CATEGORIES } from '../config/api';
import videoService from '../services/videoService';
import VideoGrid from '../components/video/VideoGrid';
import CategoryFilter from '../components/video/CategoryFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Infinite scroll hook
  const { ref: loadMoreRef, isFetching } = useInfiniteScroll(
    () => loadMoreVideos(),
    hasMore
  );

  // Load initial videos
  useEffect(() => {
    loadVideos(true);
  }, [selectedCategory]);

  const loadVideos = async (reset = false) => {
    try {
      setLoading(reset);
      setError(null);

      const params = {
        page: reset ? 1 : page,
        limit: 12,
        ...(selectedCategory !== 'All' && { category: selectedCategory }),
      };

      const response = await videoService.getAllVideos(params);
      
      if (response.success) {
        const newVideos = response.data.docs || [];
        
        if (reset) {
          setVideos(newVideos);
          setPage(2);
        } else {
          setVideos(prev => [...prev, ...newVideos]);
          setPage(prev => prev + 1);
        }

        setHasMore(response.data.hasNextPage || false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreVideos = async () => {
    if (!hasMore || isFetching) return;
    await loadVideos(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    setHasMore(true);
  };

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
      {/* Category Filter */}
      <CategoryFilter
        categories={VIDEO_CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

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
            You've reached the end of the videos
          </p>
        </div>
      )}

      {/* No videos found */}
      {videos.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No videos found for "{selectedCategory}"
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;