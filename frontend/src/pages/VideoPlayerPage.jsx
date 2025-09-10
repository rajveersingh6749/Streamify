import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import videoService from '../services/videoService';
import VideoPlayer from '../components/video/VideoPlayer';
import VideoInfo from '../components/video/VideoInfo';
import CommentSection from '../components/video/CommentSection';
import RecommendedVideos from '../components/video/RecommendedVideos';
import LoadingSpinner from '../components/common/LoadingSpinner';

const VideoPlayerPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (videoId) {
      loadVideo();
    }
  }, [videoId]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await videoService.getVideoById(videoId);
      
      if (response.success) {
        setVideo(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load video');
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
          onClick={loadVideo}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Video not found
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <VideoPlayer video={video} />
          
          {/* Video Info */}
          <VideoInfo video={video} onVideoUpdate={setVideo} />
          
          {/* Comments */}
          <CommentSection videoId={video._id} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <RecommendedVideos currentVideoId={video._id} />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;