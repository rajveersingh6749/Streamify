import React, { useState } from 'react';
import { 
  HandThumbUpIcon, 
  HandThumbDownIcon, 
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { 
  HandThumbUpIcon as HandThumbUpIconSolid 
} from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import commentService from '../../services/commentService';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import CommentForm from './CommentForm';
import { formatNumber, formatRelativeTime } from '../../utils/format';
import toast from 'react-hot-toast';

const Comment = ({ comment, onCommentUpdated, onCommentDeleted }) => {
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState({
    like: false,
    delete: false,
  });

  const isOwner = user?._id === comment.owner?._id;

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like comments');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, like: true }));
      
      const response = await commentService.toggleCommentLike(comment._id);
      
      if (response.success) {
        const newIsLiked = response.data.isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      toast.error('Failed to update like status');
    } finally {
      setLoading(prev => ({ ...prev, like: false }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      setLoading(prev => ({ ...prev, delete: true }));
      
      const response = await commentService.deleteComment(comment._id);
      
      if (response.success) {
        onCommentDeleted?.(comment._id);
        toast.success('Comment deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleCommentUpdated = (updatedComment) => {
    onCommentUpdated?.(comment._id, updatedComment);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex space-x-3">
        <Avatar
          src={comment.owner?.avatar}
          name={comment.owner?.username}
          size="sm"
        />
        
        <div className="flex-1">
          <CommentForm
            videoId={comment.video}
            initialContent={comment.content}
            commentId={comment._id}
            onCommentUpdated={handleCommentUpdated}
            onCancel={() => setIsEditing(false)}
            isEditing={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-3">
      <Avatar
        src={comment.owner?.avatar}
        name={comment.owner?.username}
        size="sm"
      />
      
      <div className="flex-1 min-w-0">
        {/* Comment Header */}
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {comment.owner?.username}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>

        {/* Comment Content */}
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          {comment.content}
        </div>

        {/* Comment Actions */}
        <div className="flex items-center space-x-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={loading.like}
            className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {isLiked ? (
              <HandThumbUpIconSolid className="w-4 h-4 text-blue-600" />
            ) : (
              <HandThumbUpIcon className="w-4 h-4" />
            )}
            {likesCount > 0 && <span>{formatNumber(likesCount)}</span>}
          </button>

          {/* Dislike Button */}
          <button className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <HandThumbDownIcon className="w-4 h-4" />
          </button>

          {/* Reply Button */}
          {isAuthenticated && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium"
            >
              Reply
            </button>
          )}

          {/* Menu Button (for owner) */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1"
              >
                <EllipsisHorizontalIcon className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-1 z-50">
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    disabled={loading.delete}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              videoId={comment.video}
              parentId={comment._id}
              onCommentAdded={() => setShowReplyForm(false)}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {/* Close menu when clicking outside */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default Comment;