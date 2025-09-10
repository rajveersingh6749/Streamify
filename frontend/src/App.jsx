import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import SearchPage from './pages/SearchPage';
import ChannelPage from './pages/ChannelPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import PlaylistPage from './pages/PlaylistPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import LikedVideosPage from './pages/LikedVideosPage';
import WatchLaterPage from './pages/WatchLaterPage';
import TrendingPage from './pages/TrendingPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Auth routes (no layout) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Main app routes (with layout) */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="trending" element={<TrendingPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="watch/:videoId" element={<VideoPlayerPage />} />
                <Route path="channel/:username" element={<ChannelPage />} />
                <Route path="playlist/:playlistId" element={<PlaylistPage />} />
                
                {/* Protected routes */}
                <Route path="upload" element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                } />
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="subscriptions" element={
                  <ProtectedRoute>
                    <SubscriptionsPage />
                  </ProtectedRoute>
                } />
                <Route path="liked-videos" element={
                  <ProtectedRoute>
                    <LikedVideosPage />
                  </ProtectedRoute>
                } />
                <Route path="watch-later" element={
                  <ProtectedRoute>
                    <WatchLaterPage />
                  </ProtectedRoute>
                } />
                <Route path="playlists" element={
                  <ProtectedRoute>
                    <PlaylistPage />
                  </ProtectedRoute>
                } />
                <Route path="settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                
                {/* 404 page */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;