// ResumeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(null);

  // Load from localStorage when app starts (only in browser environment)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem('resumeData');
        if (stored) {
          setResumeData(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading resume data from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever resumeData changes (only in browser environment)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage && resumeData) {
      try {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
      } catch (error) {
        console.error('Error saving resume data to localStorage:', error);
      }
    }
  }, [resumeData]);

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};