import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';

class DashboardService {
  // Get channel stats
  async getChannelStats() {
    const response = await api.get(API_ENDPOINTS.DASHBOARD.STATS);
    return response.data;
  }

  // Get channel videos
  async getChannelVideos() {
    const response = await api.get(API_ENDPOINTS.DASHBOARD.VIDEOS);
    return response.data;
  }
}

export default new DashboardService();