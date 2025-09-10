import React from 'react';
import Comment from './Comment';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';

const CommentList = ({ 
  comments, 
  onCommentUpdated, 
  onCommentDeleted, 
  hasMore, 
  onLoadMore, 
  loading 
}) => {
  if (comments.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onCommentUpdated={onCommentUpdated}
            onCommentDeleted={onCommentDeleted}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            loading={loading}
          >
            Load More Comments
          </Button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && comments.length > 0 && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="md" />
        </div>
      )}
    </div>
  );
};

export default CommentList;