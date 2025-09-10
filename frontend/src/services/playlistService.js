import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';

class PlaylistService {
  // Create playlist
  async createPlaylist(playlistData) {
    const response = await api.post(API_ENDPOINTS.PLAYLISTS.CREATE, playlistData);
    return response.data;
  }

  // Get playlist by ID
  async getPlaylistById(playlistId) {
    const response = await api.get(API_ENDPOINTS.PLAYLISTS.GET_BY_ID(playlistId));
    return response.data;
  }

  // Update playlist
  async updatePlaylist(playlistId, updateData) {
    const response = await api.patch(API_ENDPOINTS.PLAYLISTS.UPDATE(playlistId), updateData);
    return response.data;
  }

  // Delete playlist
  async deletePlaylist(playlistId) {
    const response = await api.delete(API_ENDPOINTS.PLAYLISTS.DELETE(playlistId));
    return response.data;
  }

  // Add video to playlist
  async addVideoToPlaylist(videoId, playlistId) {
    const response = await api.patch(API_ENDPOINTS.PLAYLISTS.ADD_VIDEO(videoId, playlistId));
    return response.data;
  }

  // Remove video from playlist
  async removeVideoFromPlaylist(videoId, playlistId) {
    const response = await api.patch(API_ENDPOINTS.PLAYLISTS.REMOVE_VIDEO(videoId, playlistId));
    return response.data;
  }

  // Get user playlists
  async getUserPlaylists(userId) {
    const response = await api.get(API_ENDPOINTS.PLAYLISTS.GET_USER_PLAYLISTS(userId));
    return response.data;
  }
}

export default new PlaylistService();