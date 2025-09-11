import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudArrowUpIcon, 
  VideoCameraIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import videoService from '../services/videoService';
import { UPLOAD_LIMITS } from '../config/api';
import { isValidVideoTitle, isValidVideoDescription } from '../utils/validation';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { formatFileSize } from '../utils/format';
import toast from 'react-hot-toast';

const UploadPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null,
  });
  
  const [previews, setPreviews] = useState({
    video: null,
    thumbnail: null,
  });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = type === 'video' 
      ? UPLOAD_LIMITS.ALLOWED_VIDEO_TYPES 
      : UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES;
    
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        [type]: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
      }));
      return;
    }

    // Validate file size
    const maxSize = type === 'video' 
      ? UPLOAD_LIMITS.VIDEO_SIZE 
      : UPLOAD_LIMITS.IMAGE_SIZE;
    
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        [type]: `File too large. Maximum size: ${formatFileSize(maxSize)}`,
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [type === 'video' ? 'videoFile' : 'thumbnail']: file,
    }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews(prev => ({
        ...prev,
        [type]: e.target.result,
      }));
    };
    reader.readAsDataURL(file);

    // Clear error
    if (errors[type]) {
      setErrors(prev => ({
        ...prev,
        [type]: '',
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (UPLOAD_LIMITS.ALLOWED_VIDEO_TYPES.includes(file.type)) {
        handleFileChange({ target: { files: [file] } }, 'video');
      } else {
        toast.error('Please drop a valid video file');
      }
    }
  };

  const removeFile = (type) => {
    setFormData(prev => ({
      ...prev,
      [type === 'video' ? 'videoFile' : 'thumbnail']: null,
    }));
    setPreviews(prev => ({
      ...prev,
      [type]: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (!isValidVideoTitle(formData.title)) {
      newErrors.title = 'Title must be 3-100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (!isValidVideoDescription(formData.description)) {
      newErrors.description = 'Description must be 10-1000 characters';
    }

    if (!formData.videoFile) {
      newErrors.video = 'Video file is required';
    }

    if (!formData.thumbnail) {
      newErrors.thumbnail = 'Thumbnail is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      const uploadData = {
        ...formData,
        onUploadProgress: (progress) => {
          setUploadProgress(progress);
        },
      };

      const response = await videoService.uploadVideo(uploadData);
      
      if (response.success) {
        toast.success('Video uploaded successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Upload Video
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Share your content with the world
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Video Upload */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Video File
          </h2>
          
          {!formData.videoFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                  : 'border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <VideoCameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Upload your video
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop a video file, or click to browse
              </p>
              
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'video')}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer btn-primary inline-flex items-center"
              >
                <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                Choose Video File
              </label>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                MP4, WebM, or OGG. Max size {formatFileSize(UPLOAD_LIMITS.VIDEO_SIZE)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <VideoCameraIcon className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formData.videoFile.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(formData.videoFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile('video')}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              {previews.video && (
                <video
                  src={previews.video}
                  controls
                  className="w-full max-w-md rounded-lg"
                />
              )}
            </div>
          )}
          
          {errors.video && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.video}
            </p>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Thumbnail
          </h2>
          
          {!formData.thumbnail ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-6 text-center">
              <PhotoIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Choose a thumbnail for your video
              </p>
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'thumbnail')}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="cursor-pointer btn-secondary inline-flex items-center"
              >
                <PhotoIcon className="w-4 h-4 mr-2" />
                Choose Thumbnail
              </label>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                JPG, PNG, or WebP. Max size {formatFileSize(UPLOAD_LIMITS.IMAGE_SIZE)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <PhotoIcon className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formData.thumbnail.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(formData.thumbnail.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile('thumbnail')}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              {previews.thumbnail && (
                <img
                  src={previews.thumbnail}
                  alt="Thumbnail preview"
                  className="w-full max-w-sm rounded-lg"
                />
              )}
            </div>
          )}
          
          {errors.thumbnail && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.thumbnail}
            </p>
          )}
        </div>

        {/* Video Details */}
        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Video Details
          </h2>
          
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            error={errors.title}
            placeholder="Enter video title"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell viewers about your video"
              className="input-field"
              rows={4}
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {loading && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Uploading...
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;