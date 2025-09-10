import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      {/* Left scroll button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-dark-900 shadow-lg rounded-full p-2 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
      )}

      {/* Categories container */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-3 overflow-x-auto scrollbar-hide py-2 px-8 lg:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="whitespace-nowrap flex-shrink-0"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Right scroll button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-dark-900 shadow-lg rounded-full p-2 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;