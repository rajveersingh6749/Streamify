import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';
import { setAuthToken, removeAuthToken } from '../utils/auth.js';

class AuthService {
  // Register new user
  async register(userData) {
    const formData = new FormData();
    formData.append('fullName', userData.fullName);
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }
    
    if (userData.coverImage) {
      formData.append('coverImage', userData.coverImage);
    }

    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Login user
  async login(credentials) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    if (response.data.success && response.data.data.accessToken) {
      setAuthToken(response.data.data.accessToken);
    }
    
    return response.data;
  }

  // Logout user
  async logout() {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
    }
  }

  // Get current user
  async getCurrentUser() {
    const response = await api.get(API_ENDPOINTS.AUTH.CURRENT_USER);
    return response.data;
  }

  // Change password
  async changePassword(passwordData) {
    const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
    return response.data;
  }

  // Update account details
  async updateAccount(accountData) {
    const response = await api.patch(API_ENDPOINTS.AUTH.UPDATE_ACCOUNT, accountData);
    return response.data;
  }

  // Update avatar
  async updateAvatar(avatarFile) {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await api.patch(API_ENDPOINTS.AUTH.UPDATE_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Update cover image
  async updateCoverImage(coverImageFile) {
    const formData = new FormData();
    formData.append('coverImage', coverImageFile);

    const response = await api.patch(API_ENDPOINTS.AUTH.UPDATE_COVER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Get user channel profile
  async getUserProfile(username) {
    const response = await api.get(API_ENDPOINTS.AUTH.USER_PROFILE(username));
    return response.data;
  }

  // Get watch history
  async getWatchHistory() {
    const response = await api.get(API_ENDPOINTS.AUTH.WATCH_HISTORY);
    return response.data;
  }

  // Refresh access token
  async refreshToken() {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
    
    if (response.data.success && response.data.data.accessToken) {
      setAuthToken(response.data.data.accessToken);
    }
    
    return response.data;
  }
}

export default new AuthService();