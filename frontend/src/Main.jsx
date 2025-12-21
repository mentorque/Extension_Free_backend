// src/Main.jsx
import React, { useEffect, useState } from 'react';
import Entry from './Entry.jsx';
import { JobDataProvider } from './context/jobContext.jsx';
import { ResumeProvider } from './context/userContext.jsx';
import { ThemeProvider } from './context/themeContext.jsx';
import { AuthProvider, useAuth } from './context/authContext.jsx';
import { useJobData } from './context/jobContext.jsx';
import { apiClient } from './utils/apiClient.js';

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider> {/* Wrap with AuthProvider */}
        <ResumeProvider>
          <JobDataProvider>
            {children}
          </JobDataProvider>
        </ResumeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const Main = () => {
  // State management for the overlay
  const [activeScreen, setActiveScreen] = useState('keywords');
  const [isResumeModalOpen, setResumeModalOpen] = useState(false);

  return (
    <AppProviders>
      <JobDataListener>
        <Entry 
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          isResumeModalOpen={isResumeModalOpen}
          setResumeModalOpen={setResumeModalOpen}
        />
      </JobDataListener>
    </AppProviders>
  );
};

// Network connectivity test function
const testApiConnectivity = async (apiBaseUrl) => {
  try {
    console.log('[MENTORQUE] Testing API connectivity...', { apiBaseUrl });
    const healthUrl = `${apiBaseUrl}/health`;
    console.log('[MENTORQUE] Testing URL:', healthUrl);
    
    const response = await apiClient.get(healthUrl);
    
    console.log('[MENTORQUE] Health check response:', {
      status: response.status,
      ok: response.ok
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('[MENTORQUE] API connectivity test successful:', data);
      return { success: true, data };
    } else {
      console.warn('[MENTORQUE] API health check failed:', {
        status: response.status
      });
      return { success: false, status: response.status, error: 'Health check failed' };
    }
  } catch (error) {
    console.error('[MENTORQUE] API connectivity test failed:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      apiBaseUrl,
      fullError: error
    });
    return { success: false, error: error.message, fullError: error };
  }
};

// Listens for content script job events and stores into context
const JobDataListener = ({ children }) => {
  const { setJobData, setAppliedJobs } = useJobData();
  const { apiKey } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      const detail = e?.detail;
      if (detail && detail.success) {
        setJobData(detail);
      }
    };
    document.addEventListener('MENTORQUE_JOB_DATA', handler);
    return () => document.removeEventListener('MENTORQUE_JOB_DATA', handler);
  }, [setJobData]);

  // DISABLED: Automatic job tracking event listener removed.
  // Users must now manually track jobs using the "Track Job" button in the overlay.
  // This useEffect previously listened for MENTORQUE_APPLIED_JOB events from content.jsx
  // and automatically added jobs to the applied jobs list.
  useEffect(() => {
    console.log('[MENTORQUE] Automatic job tracking is DISABLED. Use "Track Job" button to track applications.');
  }, []);

  return children;
};

export default Main;