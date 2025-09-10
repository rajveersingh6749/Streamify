import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';

class LikeService {
  // Toggle video like
  async toggleVideoLike(videoId) {
    const response = await api.post(API_ENDPOINTS.LIKES.TOGGLE_VIDEO_LIKE(videoId));
    return response.data;
  }

  // Toggle comment like
  async toggleCommentLike(commentId) {
    const response = await api.post(API_ENDPOINTS.LIKES.TOGGLE_COMMENT_LIKE(commentId));
    return response.data;
  }

  // Toggle tweet like
  async toggleTweetLike(tweetId) {
    const response = await api.post(API_ENDPOINTS.LIKES.TOGGLE_TWEET_LIKE(tweetId));
    return response.data;
  }

  // Get liked videos
  async getLikedVideos() {
    const response = await api.get(API_ENDPOINTS.LIKES.GET_LIKED_VIDEOS);
    return response.data;
  }
}

export default new LikeService();