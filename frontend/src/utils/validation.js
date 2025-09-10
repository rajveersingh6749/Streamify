// Validation utility functions

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Username validation
export const isValidUsername = (username) => {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Full name validation
export const isValidFullName = (fullName) => {
  // At least 2 characters, letters and spaces only
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(fullName.trim());
};

// Video title validation
export const isValidVideoTitle = (title) => {
  return title && title.trim().length >= 3 && title.trim().length <= 100;
};

// Video description validation
export const isValidVideoDescription = (description) => {
  return description && description.trim().length >= 10 && description.trim().length <= 1000;
};

// File type validation
export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

// File size validation
export const isValidFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

// URL validation
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Comment validation
export const isValidComment = (comment) => {
  return comment && comment.trim().length >= 1 && comment.trim().length <= 500;
};

// Playlist name validation
export const isValidPlaylistName = (name) => {
  return name && name.trim().length >= 3 && name.trim().length <= 50;
};

// Search query validation
export const isValidSearchQuery = (query) => {
  return query && query.trim().length >= 2 && query.trim().length <= 100;
};

// Get password strength
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, text: 'Enter a password' };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };
  
  score = Object.values(checks).filter(Boolean).length;
  
  const strengthLevels = {
    0: { text: 'Very Weak', color: 'text-red-500' },
    1: { text: 'Weak', color: 'text-red-400' },
    2: { text: 'Fair', color: 'text-yellow-500' },
    3: { text: 'Good', color: 'text-yellow-400' },
    4: { text: 'Strong', color: 'text-green-500' },
    5: { text: 'Very Strong', color: 'text-green-600' },
  };
  
  return {
    score,
    ...strengthLevels[score],
    checks,
  };
};

// Validation error messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  INVALID_USERNAME: 'Username must be 3-20 characters, alphanumeric and underscores only',
  INVALID_FULL_NAME: 'Full name must be 2-50 characters, letters and spaces only',
  INVALID_VIDEO_TITLE: 'Video title must be 3-100 characters',
  INVALID_VIDEO_DESCRIPTION: 'Video description must be 10-1000 characters',
  INVALID_FILE_TYPE: 'Invalid file type',
  INVALID_FILE_SIZE: 'File size too large',
  INVALID_COMMENT: 'Comment must be 1-500 characters',
  INVALID_PLAYLIST_NAME: 'Playlist name must be 3-50 characters',
  INVALID_SEARCH_QUERY: 'Search query must be 2-100 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
};