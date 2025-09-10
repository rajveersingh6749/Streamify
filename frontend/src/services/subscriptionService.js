import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';

class SubscriptionService {
  // Toggle subscription
  async toggleSubscription(channelId) {
    const response = await api.post(API_ENDPOINTS.SUBSCRIPTIONS.TOGGLE(channelId));
    return response.data;
  }

  // Get channel subscribers
  async getChannelSubscribers(channelId) {
    const response = await api.get(API_ENDPOINTS.SUBSCRIPTIONS.GET_SUBSCRIBERS(channelId));
    return response.data;
  }

  // Get subscribed channels
  async getSubscribedChannels(subscriberId) {
    const response = await api.get(API_ENDPOINTS.SUBSCRIPTIONS.GET_SUBSCRIBED_CHANNELS(subscriberId));
    return response.data;
  }
}

export default new SubscriptionService();