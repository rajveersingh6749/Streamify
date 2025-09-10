import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import commentService from '../../services/commentService';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatNumber } from '../../utils/format';

const CommentSection = ({ videoId }) => {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (videoId) {
      loadComments(true);
    }
  }, [videoId]);

  const loadComments = async (reset = false) => {
    try {
      setLoading(reset);
      setError(null);

      const params = {
        page: reset ? 1 : page,
        limit: 10,
      };

      const response = await commentService.getVideoComments(videoId, params);
      
      if (response.success) {
        const newComments = response.data.docs || [];
        
        if (reset) {
          setComments(newComments);
          setPage(2);
          setTotalComments(response.data.totalDocs || 0);
        } else {
          setComments(prev => [...prev, ...newComments]);
          setPage(prev => prev + 1);
        }

        setHasMore(response.data.hasNextPage || false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev]);
    setTotalComments(prev => prev + 1);
  };

  const handleCommentUpdated = (commentId, updatedComment) => {
    setComments(prev => 
      prev.map(comment => 
        comment._id === commentId ? { ...comment, ...updatedComment } : comment
      )
    );
  };

  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
    setTotalComments(prev => prev - 1);
  };

  if (loading && comments.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {formatNumber(totalComments)} Comments
        </h2>
        
        {/* Sort Options */}
        <select className="text-sm bg-transparent border-none text-gray-600 dark:text-gray-400 focus:outline-none">
          <option value="top">Top comments</option>
          <option value="newest">Newest first</option>
        </select>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <CommentForm
          videoId={videoId}
          onCommentAdded={handleCommentAdded}
        />
      ) : (
        <div className="text-center py-8 border border-gray-200 dark:border-dark-700 rounded-lg">
          <ChatBubbleLeftIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sign in to leave a comment
          </p>
          <a
            href="/login"
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Sign In
          </a>
        </div>
      )}

      {/* Comments List */}
      {error && comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => loadComments(true)}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : (
        <CommentList
          comments={comments}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
          hasMore={hasMore}
          onLoadMore={() => loadComments(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default CommentSection;