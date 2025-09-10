import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import commentService from '../../services/commentService';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const CommentForm = ({ videoId, onCommentAdded, parentId = null, onCancel = null }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setLoading(true);
      
      const response = await commentService.addComment(videoId, content.trim());
      
      if (response.success) {
        setContent('');
        setFocused(false);
        onCommentAdded?.(response.data);
        toast.success('Comment added successfully');
        
        if (onCancel) {
          onCancel();
        }
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setFocused(false);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-3">
        <Avatar
          src={user?.avatar}
          name={user?.fullName}
          size="sm"
        />
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={parentId ? 'Add a reply...' : 'Add a comment...'}
            className="w-full p-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={focused ? 4 : 2}
          />
          
          {focused && (
            <div className="flex items-center justify-end space-x-2 mt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={loading}
                disabled={!content.trim()}
              >
                {parentId ? 'Reply' : 'Comment'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommentForm;