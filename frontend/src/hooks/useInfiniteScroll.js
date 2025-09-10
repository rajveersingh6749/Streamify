import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

// Custom hook for infinite scrolling
export const useInfiniteScroll = (fetchMore, hasMore = true) => {
  const [isFetching, setIsFetching] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const fetchMoreData = useCallback(async () => {
    if (isFetching || !hasMore) return;
    
    setIsFetching(true);
    try {
      await fetchMore();
    } catch (error) {
      console.error('Error fetching more data:', error);
    } finally {
      setIsFetching(false);
    }
  }, [fetchMore, hasMore, isFetching]);

  useEffect(() => {
    if (inView && hasMore && !isFetching) {
      fetchMoreData();
    }
  }, [inView, hasMore, isFetching, fetchMoreData]);

  return { ref, isFetching };
};