import React, { useState, useEffect } from 'react';
import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import likeService from '../services/likeService';
import VideoGrid from '../components/video/VideoGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LikedVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLikedVideos();
  }, []);

  const loadLikedVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await likeService.getLikedVideos();
      
      if (response.success) {
        // Transform the data structure
        const likedVideos = response.data.map(item => item.likedVideo);
        setVideos(likedVideos);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load liked videos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={loadLikedVideos}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <HandThumbUpIcon className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Liked Videos
        </h1>
      </div>

      <p className="text-gray-600 dark:text-gray-400">
        Videos you've liked
      </p>

      {/* Videos Grid */}
      {videos.length > 0 ? (
        <VideoGrid videos={videos} />
      ) : (
        <div className="text-center py-12">
          <HandThumbUpIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No liked videos yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Videos you like will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default LikedVideosPage;