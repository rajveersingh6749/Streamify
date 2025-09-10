import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  FireIcon,
  ClockIcon,
  HandThumbUpIcon,
  PlaylistPlayIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  FireIcon as FireIconSolid,
  ClockIcon as ClockIconSolid,
  HandThumbUpIcon as HandThumbUpIconSolid,
  PlaylistPlayIcon as PlaylistPlayIconSolid,
  UserGroupIcon as UserGroupIconSolid,
} from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      public: true,
    },
    {
      name: 'Trending',
      href: '/trending',
      icon: FireIcon,
      iconSolid: FireIconSolid,
      public: true,
    },
    {
      name: 'Subscriptions',
      href: '/subscriptions',
      icon: UserGroupIcon,
      iconSolid: UserGroupIconSolid,
      requireAuth: true,
    },
  ];

  const libraryItems = [
    {
      name: 'Watch Later',
      href: '/watch-later',
      icon: ClockIcon,
      iconSolid: ClockIconSolid,
      requireAuth: true,
    },
    {
      name: 'Liked Videos',
      href: '/liked-videos',
      icon: HandThumbUpIcon,
      iconSolid: HandThumbUpIconSolid,
      requireAuth: true,
    },
    {
      name: 'Playlists',
      href: '/playlists',
      icon: PlaylistPlayIcon,
      iconSolid: PlaylistPlayIconSolid,
      requireAuth: true,
    },
  ];

  const settingsItems = [
    {
      name: 'Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
      requireAuth: true,
    },
    {
      name: 'Help',
      href: '/help',
      icon: QuestionMarkCircleIcon,
      public: true,
    },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const SidebarItem = ({ item }) => {
    const Icon = isActive(item.href) ? item.iconSolid || item.icon : item.icon;
    const active = isActive(item.href);

    if (item.requireAuth && !isAuthenticated) {
      return null;
    }

    return (
      <Link
        to={item.href}
        onClick={onClose}
        className={`
          flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
          ${active 
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
          }
        `}
      >
        <Icon className="w-6 h-6" />
        <span className="font-medium">{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-50 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700 
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarItem key={item.name} item={item} />
              ))}
            </nav>
          </div>

          {/* Library Section */}
          {isAuthenticated && (
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Library
              </h3>
              <nav className="space-y-1">
                {libraryItems.map((item) => (
                  <SidebarItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          )}

          {/* User Channel */}
          {isAuthenticated && user && (
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Your Channel
              </h3>
              <Link
                to={`/channel/${user.username}`}
                onClick={onClose}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors duration-200"
              >
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-medium truncate">{user.fullName}</span>
              </Link>
            </div>
          )}

          {/* Settings */}
          <div>
            <nav className="space-y-1">
              {settingsItems.map((item) => (
                <SidebarItem key={item.name} item={item} />
              ))}
            </nav>
          </div>

          {/* Sign in prompt for unauthenticated users */}
          {!isAuthenticated && (
            <div className="px-3 py-4 border-t border-gray-200 dark:border-dark-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Sign in to like videos, comment, and subscribe.
              </p>
              <Link
                to="/login"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;