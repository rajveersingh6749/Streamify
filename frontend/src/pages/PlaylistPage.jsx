import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  PlaylistPlayIcon,
  PlayIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import playlistService from '../services/playlistService';
import VideoGrid from '../components/video/VideoGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { formatNumber, formatRelativeTime } from '../utils/format';
import toast from 'react-hot-toast';

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  const isOwner = playlist?.owner?._id === user?._id;

  useEffect(() => {
    if (playlistId) {
      loadPlaylist();
    } else {
      // Show user's playlists
      loadUserPlaylists();
    }
  }, [playlistId]);

  const loadPlaylist = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await playlistService.getPlaylistById(playlistId);
      
      if (response.success) {
        setPlaylist(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const loadUserPlaylists = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await playlistService.getUserPlaylists(user._id);
      
      if (response.success) {
        setPlaylist({ playlists: response.data });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setFormLoading(true);
      
      const response = await playlistService.createPlaylist(formData);
      
      if (response.success) {
        toast.success('Playlist created successfully');
        setShowCreateModal(false);
        setFormData({ name: '', description: '' });
        
        if (!playlistId) {
          loadUserPlaylists();
        }
      }
    } catch (error) {
      toast.error('Failed to create playlist');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setFormLoading(true);
      
      const response = await playlistService.updatePlaylist(playlistId, formData);
      
      if (response.success) {
        toast.success('Playlist updated successfully');
        setShowEditModal(false);
        setPlaylist(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      toast.error('Failed to update playlist');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) {
      return;
    }

    try {
      const response = await playlistService.deletePlaylist(playlistId);
      
      if (response.success) {
        toast.success('Playlist deleted successfully');
        window.history.back();
      }
    } catch (error) {
      toast.error('Failed to delete playlist');
    }
  };

  const openEditModal = () => {
    setFormData({
      name: playlist.name,
      description: playlist.description,
    });
    setShowEditModal(true);
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
          onClick={playlistId ? loadPlaylist : loadUserPlaylists}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show user's playlists
  if (!playlistId) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PlaylistPlayIcon className="w-8 h-8 text-purple-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Your Playlists
            </h1>
          </div>

          {isAuthenticated && (
            <Button
              variant="primary"
              icon={PlusIcon}
              onClick={() => setShowCreateModal(true)}
            >
              Create Playlist
            </Button>
          )}
        </div>

        {/* Playlists Grid */}
        {playlist?.playlists?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlist.playlists.map((item) => (
              <div key={item._id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <PlaylistPlayIcon className="w-8 h-8 text-purple-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatNumber(item.totalVideos)} videos
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {item.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatNumber(item.totalViews)} views</span>
                  <span>{formatRelativeTime(item.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <PlaylistPlayIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No playlists yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first playlist to organize your videos
            </p>
            {isAuthenticated && (
              <Button
                variant="primary"
                icon={PlusIcon}
                onClick={() => setShowCreateModal(true)}
              >
                Create Playlist
              </Button>
            )}
          </div>
        )}

        {/* Create Playlist Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Playlist"
        >
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <Input
              label="Playlist Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter playlist name"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter playlist description"
                className="input-field"
                rows={3}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={formLoading}
              >
                Create Playlist
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // Show individual playlist
  if (!playlist) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Playlist not found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Playlist Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <PlaylistPlayIcon className="w-8 h-8 text-purple-600" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {playlist.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {playlist.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{formatNumber(playlist.totalVideos)} videos</span>
                <span>•</span>
                <span>{formatNumber(playlist.totalViews)} views</span>
                <span>•</span>
                <span>Updated {formatRelativeTime(playlist.updatedAt)}</span>
              </div>
              
              {playlist.owner && (
                <div className="flex items-center space-x-2 mt-2">
                  <img
                    src={playlist.owner.avatar}
                    alt={playlist.owner.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {playlist.owner.username}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {isOwner && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={PencilIcon}
                onClick={openEditModal}
              >
                Edit
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                icon={TrashIcon}
                onClick={handleDeletePlaylist}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Videos */}
      {playlist.videos?.length > 0 ? (
        <VideoGrid videos={playlist.videos} />
      ) : (
        <div className="text-center py-12">
          <PlayIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No videos in this playlist
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Videos will appear here when they're added to the playlist
          </p>
        </div>
      )}

      {/* Edit Playlist Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Playlist"
      >
        <form onSubmit={handleUpdatePlaylist} className="space-y-4">
          <Input
            label="Playlist Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter playlist name"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter playlist description"
              className="input-field"
              rows={3}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formLoading}
            >
              Update Playlist
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlaylistPage;