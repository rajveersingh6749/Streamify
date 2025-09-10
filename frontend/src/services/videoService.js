import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';

class VideoService {
  // Get all videos with filters and pagination
  async getAllVideos(params = {}) {
    const response = await api.get(API_ENDPOINTS.VIDEOS.GET_ALL, { params });
    return response.data;
  }

  // Get video by ID
  async getVideoById(videoId) {
    const response = await api.get(API_ENDPOINTS.VIDEOS.GET_BY_ID(videoId));
    return response.data;
  }

  // Upload new video
  async uploadVideo(videoData) {
    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('videoFile', videoData.videoFile);
    formData.append('thumbnail', videoData.thumbnail);

    const response = await api.post(API_ENDPOINTS.VIDEOS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (videoData.onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          videoData.onUploadProgress(percentCompleted);
        }
      },
    });

    return response.data;
  }

  // Update video
  async updateVideo(videoId, updateData) {
    const formData = new FormData();
    formData.append('title', updateData.title);
    formData.append('description', updateData.description);
    
    if (updateData.thumbnail) {
      formData.append('thumbnail', updateData.thumbnail);
    }

    const response = await api.patch(API_ENDPOINTS.VIDEOS.UPDATE(videoId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Delete video
  async deleteVideo(videoId) {
    const response = await api.delete(API_ENDPOINTS.VIDEOS.DELETE(videoId));
    return response.data;
  }

  // Toggle video publish status
  async togglePublishStatus(videoId) {
    const response = await api.patch(API_ENDPOINTS.VIDEOS.TOGGLE_PUBLISH(videoId));
    return response.data;
  }

  // Search videos
  async searchVideos(query, params = {}) {
    const searchParams = {
      query,
      ...params,
    };
    
    const response = await api.get(API_ENDPOINTS.VIDEOS.GET_ALL, { 
      params: searchParams 
    });
    return response.data;
  }

  // Get videos by category
  async getVideosByCategory(category, params = {}) {
    const categoryParams = {
      category,
      ...params,
    };
    
    const response = await api.get(API_ENDPOINTS.VIDEOS.GET_ALL, { 
      params: categoryParams 
    });
    return response.data;
  }

  // Get trending videos
  async getTrendingVideos(params = {}) {
    const trendingParams = {
      sortBy: 'views',
      sortType: 'desc',
      ...params,
    };
    
    const response = await api.get(API_ENDPOINTS.VIDEOS.GET_ALL, { 
      params: trendingParams 
    });
    return response.data;
  }

  // Get user's videos
  async getUserVideos(userId, params = {}) {
    const userParams = {
      userId,
      ...params,
    };
    
    const response = await api.get(API_ENDPOINTS.VIDEOS.GET_ALL, { 
      params: userParams 
    });
    return response.data;
  }
}

export default new VideoService();