import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EllipsisVerticalIcon, ClockIcon, PlusIcon } from '@heroicons/react/24/outline';
import { formatNumber, formatRelativeTime, formatDuration } from '../../utils/format';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

const VideoCard = ({ video, showChannel = true, className = '' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleAddToWatchLater = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement add to watch later
    console.log('Add to watch later:', video._id);
    setShowMenu(false);
  };

  const handleAddToPlaylist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement add to playlist
    console.log('Add to playlist:', video._id);
    setShowMenu(false);
  };

  return (
    <div className={`group relative ${className}`}>
      <Link to={`/watch/${video._id}`} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200 dark:bg-dark-700 rounded-lg overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-dark-700 animate-pulse" />
          )}
          
          <img
            src={video.thumbnail?.url || video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = '/placeholder-video.jpg'; // Fallback image
              setImageLoaded(true);
            }}
          />
          
          {/* Duration */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
        </div>

        {/* Video Info */}
        <div className="mt-3 flex space-x-3">
          {/* Channel Avatar */}
          {showChannel && video.ownerDetails && (
            <div className="flex-shrink-0">
              <Avatar
                src={video.ownerDetails.avatar}
                name={video.ownerDetails.username}
                size="sm"
              />
            </div>
          )}

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {video.title}
            </h3>
            
            {showChannel && video.ownerDetails && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                {video.ownerDetails.username}
              </p>
            )}
            
            <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
              <span>{formatNumber(video.views)} views</span>
              <span>•</span>
              <span>{formatRelativeTime(video.createdAt)}</span>
            </div>
          </div>

          {/* Menu Button */}
          <div className="relative flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMenuClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <EllipsisVerticalIcon className="w-4 h-4" />
            </Button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-1 z-50">
                <button
                  onClick={handleAddToWatchLater}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                >
                  <ClockIcon className="w-4 h-4 mr-3" />
                  Save to Watch Later
                </button>
                
                <button
                  onClick={handleAddToPlaylist}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                >
                  <PlusIcon className="w-4 h-4 mr-3" />
                  Save to Playlist
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Close menu when clicking outside */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default VideoCard;