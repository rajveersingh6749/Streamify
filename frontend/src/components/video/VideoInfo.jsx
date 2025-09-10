import React, { useState } from 'react';
import { 
  HandThumbUpIcon, 
  HandThumbDownIcon, 
  ShareIcon,
  EllipsisHorizontalIcon,
  UserPlusIcon,
  UserMinusIcon
} from '@heroicons/react/24/outline';
import { 
  HandThumbUpIcon as HandThumbUpIconSolid,
  HandThumbDownIcon as HandThumbDownIconSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { formatNumber, formatRelativeTime } from '../../utils/format';
import likeService from '../../services/likeService';
import subscriptionService from '../../services/subscriptionService';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const VideoInfo = ({ video, onVideoUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [likesCount, setLikesCount] = useState(video.likesCount || 0);
  const [isSubscribed, setIsSubscribed] = useState(video.owner?.isSubscribed || false);
  const [subscribersCount, setSubscribersCount] = useState(video.owner?.subscribersCount || 0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState({
    like: false,
    subscribe: false,
  });

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like videos');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, like: true }));
      
      const response = await likeService.toggleVideoLike(video._id);
      
      if (response.success) {
        const newIsLiked = response.data.isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
        
        toast.success(newIsLiked ? 'Added to liked videos' : 'Removed from liked videos');
      }
    } catch (error) {
      toast.error('Failed to update like status');
    } finally {
      setLoading(prev => ({ ...prev, like: false }));
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to subscribe');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, subscribe: true }));
      
      const response = await subscriptionService.toggleSubscription(video.owner._id);
      
      if (response.success) {
        const newIsSubscribed = response.data.subscribed;
        setIsSubscribed(newIsSubscribed);
        setSubscribersCount(prev => newIsSubscribed ? prev + 1 : prev - 1);
        
        toast.success(newIsSubscribed ? 'Subscribed!' : 'Unsubscribed');
      }
    } catch (error) {
      toast.error('Failed to update subscription');
    } finally {
      setLoading(prev => ({ ...prev, subscribe: false }));
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: url,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Title */}
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {video.title}
      </h1>

      {/* Video Stats and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{formatNumber(video.views)} views</span>
          <span>•</span>
          <span>{formatRelativeTime(video.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Like Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            loading={loading.like}
            className="flex items-center space-x-2"
          >
            {isLiked ? (
              <HandThumbUpIconSolid className="w-5 h-5 text-blue-600" />
            ) : (
              <HandThumbUpIcon className="w-5 h-5" />
            )}
            <span>{formatNumber(likesCount)}</span>
          </Button>

          {/* Dislike Button */}
          <Button
            variant="outline"
            size="sm"
            className="p-2"
          >
            <HandThumbDownIcon className="w-5 h-5" />
          </Button>

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            icon={ShareIcon}
          >
            Share
          </Button>

          {/* More Actions */}
          <Button
            variant="outline"
            size="sm"
            className="p-2"
          >
            <EllipsisHorizontalIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Channel Info */}
      <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
        <Avatar
          src={video.owner?.avatar}
          name={video.owner?.username}
          size="lg"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {video.owner?.username}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatNumber(subscribersCount)} subscribers
              </p>
            </div>

            {/* Subscribe Button */}
            <Button
              variant={isSubscribed ? "outline" : "primary"}
              size="sm"
              onClick={handleSubscribe}
              loading={loading.subscribe}
              icon={isSubscribed ? UserMinusIcon : UserPlusIcon}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          </div>

          {/* Description */}
          <div className="mt-3">
            <div className={`text-sm text-gray-700 dark:text-gray-300 ${
              showFullDescription ? '' : 'line-clamp-3'
            }`}>
              {video.description}
            </div>
            
            {video.description && video.description.length > 200 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;