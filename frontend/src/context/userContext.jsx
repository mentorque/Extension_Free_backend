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
          const parsed = JSON.parse(stored);
          setResumeData(parsed);
          console.log('[ResumeContext] ✅ Loaded resume data from localStorage:', {
            hasName: !!parsed?.result?.formatted_resume?.name,
            hasSkills: !!parsed?.result?.formatted_resume?.skills,
            skillsCount: parsed?.result?.formatted_resume?.skills?.length || 0
          });
        } else {
          console.log('[ResumeContext] ℹ️  No resume data found in localStorage');
        }
      } catch (error) {
        console.error('[ResumeContext] ❌ Error loading resume data from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever resumeData changes (only in browser environment)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage && resumeData) {
      try {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
        console.log('[ResumeContext] 💾 Saved resume data to localStorage:', {
          hasName: !!resumeData?.result?.formatted_resume?.name,
          hasSkills: !!resumeData?.result?.formatted_resume?.skills,
          skillsCount: resumeData?.result?.formatted_resume?.skills?.length || 0
        });
      } catch (error) {
        console.error('[ResumeContext] ❌ Error saving resume data to localStorage:', error);
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