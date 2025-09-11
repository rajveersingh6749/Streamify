import React, { useState } from 'react';
import { 
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Avatar from '../components/common/Avatar';
import Modal from '../components/common/Modal';
import { isValidEmail, isValidFullName, isValidPassword } from '../utils/validation';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, updateProfile, updateAvatar, updateCoverImage, changePassword } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState({
    profile: false,
    avatar: false,
    coverImage: false,
    password: false,
  });
  
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'security', name: 'Security', icon: KeyIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'account', name: 'Account', icon: TrashIcon },
  ];

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!profileData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (!isValidFullName(profileData.fullName)) {
      newErrors.fullName = 'Full name must be 2-50 characters, letters and spaces only';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(profileData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(prev => ({ ...prev, profile: true }));
      
      const result = await updateProfile(profileData);
      
      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(prev => ({ ...prev, avatar: true }));
      
      const result = await updateAvatar(file);
      
      if (result.success) {
        toast.success('Avatar updated successfully');
      } else {
        toast.error(result.message || 'Failed to update avatar');
      }
    } catch (error) {
      toast.error('Failed to update avatar');
    } finally {
      setLoading(prev => ({ ...prev, avatar: false }));
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(prev => ({ ...prev, coverImage: true }));
      
      const result = await updateCoverImage(file);
      
      if (result.success) {
        toast.success('Cover image updated successfully');
      } else {
        toast.error(result.message || 'Failed to update cover image');
      }
    } catch (error) {
      toast.error('Failed to update cover image');
    } finally {
      setLoading(prev => ({ ...prev, coverImage: false }));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!passwordData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!isValidPassword(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(prev => ({ ...prev, password: true }));
      
      const result = await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (result.success) {
        toast.success('Password changed successfully');
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Profile Information
            </h2>
            
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <Avatar
                src={user?.avatar}
                name={user?.fullName}
                size="xl"
              />
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Profile Picture
                </h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer btn-secondary"
                  >
                    {loading.avatar ? 'Uploading...' : 'Change Avatar'}
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG or WebP. Max size 5MB.
                </p>
              </div>
            </div>

            {/* Cover Image Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Cover Image
              </h3>
              <div className="w-full h-32 bg-gray-200 dark:bg-dark-700 rounded-lg overflow-hidden mb-3">
                {user?.coverImage ? (
                  <img
                    src={user.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No cover image
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="cursor-pointer btn-secondary"
                >
                  {loading.coverImage ? 'Uploading...' : 'Change Cover'}
                </label>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <Input
                label="Full Name"
                value={profileData.fullName}
                onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                error={errors.fullName}
                placeholder="Enter your full name"
              />
              
              <Input
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                error={errors.email}
                placeholder="Enter your email"
              />
              
              <Input
                label="Username"
                value={user?.username || ''}
                disabled
                helperText="Username cannot be changed"
              />
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading.profile}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Security Settings
            </h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                error={errors.oldPassword}
                placeholder="Enter current password"
              />
              
              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                error={errors.newPassword}
                placeholder="Enter new password"
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                error={errors.confirmPassword}
                placeholder="Confirm new password"
              />
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading.password}
                >
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Notification Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications for new videos and updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  defaultChecked
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Push Notifications
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications in your browser
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Privacy Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Public Profile
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Make your profile visible to other users
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  defaultChecked
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Show Watch History
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow others to see your watch history
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Account Management
            </h2>
            
            <div className="card p-6 border-red-200 dark:border-red-800">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <TrashIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-red-900 dark:text-red-100">
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <div className="mt-4">
                    <Button
                      variant="danger"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="card p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete your account? This action cannot be undone and will permanently delete:
          </p>
          
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>Your profile and account information</li>
            <li>All your uploaded videos</li>
            <li>Your playlists and watch history</li>
            <li>Your comments and likes</li>
          </ul>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                // TODO: Implement account deletion
                toast.error('Account deletion not implemented yet');
                setShowDeleteModal(false);
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;