import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';

class CommentService {
  // Get video comments
  async getVideoComments(videoId, params = {}) {
    const response = await api.get(API_ENDPOINTS.COMMENTS.GET_VIDEO_COMMENTS(videoId), {
      params,
    });
    return response.data;
  }

  // Add comment to video
  async addComment(videoId, content) {
    const response = await api.post(API_ENDPOINTS.COMMENTS.ADD_COMMENT(videoId), {
      content,
    });
    return response.data;
  }

  // Update comment
  async updateComment(commentId, content) {
    const response = await api.patch(API_ENDPOINTS.COMMENTS.UPDATE_COMMENT(commentId), {
      content,
    });
    return response.data;
  }

  // Delete comment
  async deleteComment(commentId) {
    const response = await api.delete(API_ENDPOINTS.COMMENTS.DELETE_COMMENT(commentId));
    return response.data;
  }

  // Toggle comment like
  async toggleCommentLike(commentId) {
    const response = await api.post(API_ENDPOINTS.LIKES.TOGGLE_COMMENT_LIKE(commentId));
    return response.data;
  }
}

export default new CommentService();