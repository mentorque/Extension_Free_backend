import React, { createContext, useContext, useState, useEffect } from 'react';

const RequestContext = createContext();

export const useRequest = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequest must be used within RequestProvider');
  }
  return context;
};

export const RequestProvider = ({ children }) => {
  const [keywordRequestCount, setKeywordRequestCount] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem('keywordRequestCount');
    const formSubmitted = localStorage.getItem('freetrialUserSubmitted');
    
    if (savedCount) {
      setKeywordRequestCount(parseInt(savedCount, 10));
    }
    
    if (formSubmitted === 'true') {
      setIsFormSubmitted(true);
    }
  }, []);

  const incrementKeywordRequest = () => {
    const newCount = keywordRequestCount + 1;
    setKeywordRequestCount(newCount);
    localStorage.setItem('keywordRequestCount', newCount.toString());
    return newCount;
  };

  const resetKeywordRequestCount = () => {
    setKeywordRequestCount(0);
    localStorage.setItem('keywordRequestCount', '0');
  };

  const markFormSubmitted = () => {
    setIsFormSubmitted(true);
    localStorage.setItem('freetrialUserSubmitted', 'true');
  };

  const shouldShowForm = () => {
    // Check localStorage directly for current count
    const currentCount = parseInt(localStorage.getItem('keywordRequestCount') || '0', 10);
    const formSubmitted = localStorage.getItem('freetrialUserSubmitted') === 'true';
    return currentCount >= 2 && !formSubmitted;
  };

  const shouldShowAd = () => {
    // Check localStorage directly for current count
    const currentCount = parseInt(localStorage.getItem('keywordRequestCount') || '0', 10);
    return currentCount > 0 && currentCount % 10 === 0;
  };

  const value = {
    keywordRequestCount,
    isFormSubmitted,
    incrementKeywordRequest,
    resetKeywordRequestCount,
    markFormSubmitted,
    shouldShowForm,
    shouldShowAd,
  };

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};

