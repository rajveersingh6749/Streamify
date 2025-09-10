// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    REFRESH_TOKEN: '/users/refresh-token',
    CURRENT_USER: '/users/current-user',
    CHANGE_PASSWORD: '/users/change-password',
    UPDATE_ACCOUNT: '/users/update-account',
    UPDATE_AVATAR: '/users/avatar',
    UPDATE_COVER: '/users/cover-image',
    USER_PROFILE: (username) => `/users/c/${username}`,
    WATCH_HISTORY: '/users/history',
  },
  
  // Video endpoints
  VIDEOS: {
    GET_ALL: '/videos',
    GET_BY_ID: (id) => `/videos/${id}`,
    UPLOAD: '/videos',
    UPDATE: (id) => `/videos/${id}`,
    DELETE: (id) => `/videos/${id}`,
    TOGGLE_PUBLISH: (id) => `/videos/toggle/publish/${id}`,
  },
  
  // Comment endpoints
  COMMENTS: {
    GET_VIDEO_COMMENTS: (videoId) => `/comments/${videoId}`,
    ADD_COMMENT: (videoId) => `/comments/${videoId}`,
    UPDATE_COMMENT: (commentId) => `/comments/c/${commentId}`,
    DELETE_COMMENT: (commentId) => `/comments/c/${commentId}`,
  },
  
  // Like endpoints
  LIKES: {
    TOGGLE_VIDEO_LIKE: (videoId) => `/likes/toggle/v/${videoId}`,
    TOGGLE_COMMENT_LIKE: (commentId) => `/likes/toggle/c/${commentId}`,
    TOGGLE_TWEET_LIKE: (tweetId) => `/likes/toggle/t/${tweetId}`,
    GET_LIKED_VIDEOS: '/likes/videos',
  },
  
  // Subscription endpoints
  SUBSCRIPTIONS: {
    TOGGLE: (channelId) => `/subscriptions/c/${channelId}`,
    GET_SUBSCRIBERS: (channelId) => `/subscriptions/c/${channelId}`,
    GET_SUBSCRIBED_CHANNELS: (subscriberId) => `/subscriptions/u/${subscriberId}`,
  },
  
  // Playlist endpoints
  PLAYLISTS: {
    CREATE: '/playlist',
    GET_BY_ID: (id) => `/playlist/${id}`,
    UPDATE: (id) => `/playlist/${id}`,
    DELETE: (id) => `/playlist/${id}`,
    ADD_VIDEO: (videoId, playlistId) => `/playlist/add/${videoId}/${playlistId}`,
    REMOVE_VIDEO: (videoId, playlistId) => `/playlist/remove/${videoId}/${playlistId}`,
    GET_USER_PLAYLISTS: (userId) => `/playlist/user/${userId}`,
  },
  
  // Dashboard endpoints
  DASHBOARD: {
    STATS: '/dashboard/stats',
    VIDEOS: '/dashboard/videos',
  },
  
  // Community posts (tweets) endpoints
  COMMUNITY: {
    CREATE: '/community-posts',
    GET_USER_POSTS: (userId) => `/community-posts/user/${userId}`,
    UPDATE: (tweetId) => `/community-posts/${tweetId}`,
    DELETE: (tweetId) => `/community-posts/${tweetId}`,
  },
  
  // Health check
  HEALTH: '/healthcheck',
};

// Request timeout
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// File upload limits
export const UPLOAD_LIMITS = {
  VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  IMAGE_SIZE: 5 * 1024 * 1024,   // 5MB
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
};

// Video categories
export const VIDEO_CATEGORIES = [
  'All',
  'Music',
  'Gaming',
  'Sports',
  'News',
  'Movies',
  'Live',
  'Fashion',
  'Learning',
  'Spotlight',
  'Comedy',
  'Entertainment',
  'Technology',
  'Science',
  'Travel',
  'Food',
  'Health',
  'Art',
  'History',
  'Documentary',
];