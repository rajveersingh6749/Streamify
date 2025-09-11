import React, { useState, useEffect } from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import subscriptionService from '../services/subscriptionService';
import VideoGrid from '../components/video/VideoGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Avatar from '../components/common/Avatar';
import { formatNumber } from '../utils/format';
import { Link } from 'react-router-dom';

const SubscriptionsPage = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?._id) {
      loadSubscriptions();
      loadSubscriptionVideos();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await subscriptionService.getSubscribedChannels(user._id);
      
      if (response.success) {
        setSubscriptions(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptionVideos = async () => {
    try {
      setVideosLoading(true);

      // Get videos from subscribed channels
      // This would need to be implemented in the backend
      // For now, we'll show a placeholder
      setVideos([]);
    } catch (err) {
      console.error('Failed to load subscription videos:', err);
    } finally {
      setVideosLoading(false);
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
          onClick={loadSubscriptions}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <UserGroupIcon className="w-8 h-8 text-purple-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Subscriptions
        </h1>
      </div>

      {/* Subscribed Channels */}
      {subscriptions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Your Subscriptions ({subscriptions.length})
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {subscriptions.map((subscription) => {
              const channel = subscription.subscribedChannel;
              return (
                <Link
                  key={channel._id}
                  to={`/channel/${channel.username}`}
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                >
                  <Avatar
                    src={channel.avatar}
                    name={channel.fullName}
                    size="lg"
                    className="mb-3"
                  />
                  
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center line-clamp-2 mb-1">
                    {channel.fullName}
                  </h3>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    @{channel.username}
                  </p>
                  
                  {channel.latestVideo && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                      Latest: {channel.latestVideo.title}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Latest Videos from Subscriptions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Latest Videos
        </h2>
        
        {videosLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
        ) : videos.length > 0 ? (
          <VideoGrid videos={videos} />
        ) : subscriptions.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No recent videos from your subscriptions
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <UserGroupIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No subscriptions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Subscribe to channels to see their latest videos here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;