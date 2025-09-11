import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  UserPlusIcon, 
  UserMinusIcon,
  VideoCameraIcon,
  PlayIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import videoService from '../services/videoService';
import subscriptionService from '../services/subscriptionService';
import VideoGrid from '../components/video/VideoGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import { formatNumber } from '../utils/format';
import toast from 'react-hot-toast';

const ChannelPage = () => {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const isOwnChannel = currentUser?.username === username;

  useEffect(() => {
    if (username) {
      loadChannelData();
      loadChannelVideos();
    }
  }, [username]);

  const loadChannelData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.getUserProfile(username);
      
      if (response.success) {
        setChannel(response.data);
        setIsSubscribed(response.data.isSubscribed || false);
        setSubscribersCount(response.data.subscribersCount || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load channel');
    } finally {
      setLoading(false);
    }
  };

  const loadChannelVideos = async () => {
    try {
      setVideosLoading(true);

      const response = await videoService.getUserVideos(username, {
        limit: 20,
        sortBy: 'createdAt',
        sortType: 'desc',
      });
      
      if (response.success) {
        setVideos(response.data.docs || []);
      }
    } catch (err) {
      console.error('Failed to load channel videos:', err);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to subscribe');
      return;
    }

    if (!channel?._id) return;

    try {
      setSubscribeLoading(true);
      
      const response = await subscriptionService.toggleSubscription(channel._id);
      
      if (response.success) {
        const newIsSubscribed = response.data.subscribed;
        setIsSubscribed(newIsSubscribed);
        setSubscribersCount(prev => newIsSubscribed ? prev + 1 : prev - 1);
        
        toast.success(newIsSubscribed ? 'Subscribed!' : 'Unsubscribed');
      }
    } catch (error) {
      toast.error('Failed to update subscription');
    } finally {
      setSubscribeLoading(false);
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
          onClick={loadChannelData}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Channel not found
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'videos', name: 'Videos', icon: VideoCameraIcon },
    { id: 'playlists', name: 'Playlists', icon: PlayIcon },
    { id: 'about', name: 'About', icon: UserGroupIcon },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Channel Header */}
      <div className="relative">
        {/* Cover Image */}
        {channel.coverImage && (
          <div className="h-32 sm:h-48 lg:h-64 bg-gray-200 dark:bg-dark-700 rounded-lg overflow-hidden">
            <img
              src={channel.coverImage}
              alt={`${channel.fullName} cover`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Channel Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 mt-6">
          <Avatar
            src={channel.avatar}
            name={channel.fullName}
            size="2xl"
            className="border-4 border-white dark:border-dark-900"
          />

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {channel.fullName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              @{channel.username}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{formatNumber(subscribersCount)} subscribers</span>
              <span>•</span>
              <span>{formatNumber(videos.length)} videos</span>
            </div>
          </div>

          {/* Subscribe Button */}
          {!isOwnChannel && (
            <Button
              variant={isSubscribed ? "outline" : "primary"}
              onClick={handleSubscribe}
              loading={subscribeLoading}
              icon={isSubscribed ? UserMinusIcon : UserPlusIcon}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-dark-700 mt-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'videos' && (
          <div>
            {videosLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="md" />
              </div>
            ) : videos.length > 0 ? (
              <VideoGrid videos={videos} showChannel={false} />
            ) : (
              <div className="text-center py-12">
                <VideoCameraIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No videos yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isOwnChannel 
                    ? "Upload your first video to get started!"
                    : "This channel hasn't uploaded any videos yet."
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="text-center py-12">
            <PlayIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No playlists yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Playlists will appear here when they're created.
            </p>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                About
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Channel Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Subscribers:</span>
                      <span className="ml-2 font-medium">{formatNumber(subscribersCount)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Videos:</span>
                      <span className="ml-2 font-medium">{formatNumber(videos.length)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Channel Details
                  </h4>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Username:</span>
                      <span className="ml-2">@{channel.username}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="ml-2">{channel.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;