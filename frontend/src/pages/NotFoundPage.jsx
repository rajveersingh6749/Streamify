import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 dark:text-dark-700">
            404
          </h1>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button
            as={Link}
            to="/"
            variant="primary"
            size="lg"
            icon={HomeIcon}
          >
            Go Home
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="lg"
          >
            Go Back
          </Button>
        </div>
        
        <div className="mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you think this is a mistake, please{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;