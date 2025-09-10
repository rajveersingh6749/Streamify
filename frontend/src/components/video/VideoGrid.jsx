import React from 'react';
import VideoCard from './VideoCard';
import { SkeletonCard } from '../common/Skeleton';

const VideoGrid = ({ videos, loading = false, skeletonCount = 12 }) => {
  if (loading) {
    return (
      <div className="video-grid">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No videos found
        </p>
      </div>
    );
  }

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;