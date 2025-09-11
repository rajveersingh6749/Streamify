import React, { useState, useEffect } from 'react';
import videoService from '../../services/videoService';
import VideoCard from './VideoCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { SkeletonCard } from '../common/Skeleton';

const RecommendedVideos = ({ currentVideoId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendedVideos();
  }, [currentVideoId]);

  const loadRecommendedVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get recommended videos (excluding current video)
      const response = await videoService.getAllVideos({
        limit: 20,
        sortBy: 'views',
        sortType: 'desc',
      });
      
      if (response.success) {
        // Filter out current video
        const filteredVideos = response.data.docs?.filter(
          video => video._id !== currentVideoId
        ) || [];
        
        setVideos(filteredVideos.slice(0, 15)); // Limit to 15 videos
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recommended videos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recommended
        </h3>
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex space-x-3">
              <div className="w-40 h-24 bg-gray-200 dark:bg-dark-700 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={loadRecommendedVideos}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Recommended
      </h3>
      
      <div className="space-y-4">
        {videos.map((video) => (
          <div key={video._id} className="flex space-x-3">
            <div className="w-40 flex-shrink-0">
              <VideoCard 
                video={video} 
                showChannel={false}
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No recommended videos found
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendedVideos;