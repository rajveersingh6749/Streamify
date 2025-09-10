import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  VideoCameraIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useDebounce } from '../../hooks/useDebounce';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import SearchBar from './SearchBar';

const Header = ({ onMenuToggle, isMenuOpen }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user?.username) {
      navigate(`/channel/${user.username}`);
      setShowUserMenu(false);
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Menu toggle for mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden p-2"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <VideoCameraIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              VideoTube
            </span>
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <SearchBar />
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2"
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {isDarkMode ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </Button>

          {/* User section */}
          {isAuthenticated ? (
            <div className="relative">
              {/* Upload button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/upload')}
                className="p-2 mr-2"
              >
                <VideoCameraIcon className="w-6 h-6" />
              </Button>

              {/* User avatar */}
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              >
                <Avatar
                  src={user?.avatar}
                  name={user?.fullName}
                  size="sm"
                />
              </button>

              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-1 z-50">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <UserCircleIcon className="w-4 h-4 mr-3" />
                    Your Channel
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <Cog6ToothIcon className="w-4 h-4 mr-3" />
                    Dashboard
                  </button>
                  
                  <hr className="my-1 border-gray-200 dark:border-dark-600" />
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {showMobileSearch && (
        <div className="px-4 pb-3 md:hidden">
          <SearchBar onSearch={() => setShowMobileSearch(false)} />
        </div>
      )}

      {/* Close user menu when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;