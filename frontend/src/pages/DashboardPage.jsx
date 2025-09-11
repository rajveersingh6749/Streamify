import React, { useState, useEffect } from 'react';
import { 
  VideoCameraIcon,
  EyeIcon,
  UserGroupIcon,
  HandThumbUpIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import videoService from '../services/videoService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { formatNumber, formatRelativeTime, formatDuration } from '../utils/format';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
    loadChannelVideos();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardService.getChannelStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadChannelVideos = async () => {
    try {
      setVideosLoading(true);

      const response = await dashboardService.getChannelVideos();
      
      if (response.success) {
        setVideos(response.data);
      }
    } catch (err) {
      console.error('Failed to load channel videos:', err);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleTogglePublish = async (videoId, currentStatus) => {
    try {
      const response = await videoService.togglePublishStatus(videoId);
      
      if (response.success) {
        setVideos(prev => 
          prev.map(video => 
            video._id === videoId 
              ? { ...video, isPublished: response.data.isPublished }
              : video
          )
        );
        
        toast.success(
          response.data.isPublished ? 'Video published' : 'Video unpublished'
        );
      }
    } catch (error) {
      toast.error('Failed to update video status');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await videoService.deleteVideo(videoId);
      
      if (response.success) {
        setVideos(prev => prev.filter(video => video._id !== videoId));
        toast.success('Video deleted successfully');
        
        // Reload stats
        loadDashboardData();
      }
    } catch (error) {
      toast.error('Failed to delete video');
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
          onClick={loadDashboardData}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Videos',
      value: stats?.totalVideos || 0,
      icon: VideoCameraIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Total Views',
      value: formatNumber(stats?.totalViews || 0),
      icon: EyeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Subscribers',
      value: formatNumber(stats?.totalSubscribers || 0),
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Total Likes',
      value: formatNumber(stats?.totalLikes || 0),
      icon: HandThumbUpIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.fullName}
          </p>
        </div>

        <Button
          as={Link}
          to="/upload"
          variant="primary"
          icon={PlusIcon}
        >
          Upload Video
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Videos Table */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Your Videos
          </h2>
        </div>

        <div className="overflow-x-auto">
          {videosLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : videos.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead className="bg-gray-50 dark:bg-dark-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Video
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Likes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-900 divide-y divide-gray-200 dark:divide-dark-700">
                {videos.map((video) => (
                  <tr key={video._id} className="hover:bg-gray-50 dark:hover:bg-dark-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-24">
                          <img
                            className="h-16 w-24 rounded-lg object-cover"
                            src={video.thumbnail?.url || video.thumbnail}
                            alt={video.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                            {video.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        video.isPublished
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {video.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatNumber(video.views)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatNumber(video.likesCount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(video.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(video._id, video.isPublished)}
                          title={video.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {video.isPublished ? (
                            <EyeSlashIcon className="w-4 h-4" />
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          as={Link}
                          to={`/video/edit/${video._id}`}
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVideo(video._id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <VideoCameraIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No videos yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upload your first video to get started!
              </p>
              <Button
                as={Link}
                to="/upload"
                variant="primary"
                icon={PlusIcon}
              >
                Upload Video
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;