// src/context/jobContext.jsx
import { createContext, useContext, useState } from 'react';

const JobDataContext = createContext();

export const JobDataProvider = ({ children }) => {
  const [jobData, setJobData] = useState(null);
  const [keywordsData, setKeywordsData] = useState(null);
  const [experienceData, setExperienceData] = useState(null);
  const [coverLetterData, setCoverLetterData] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);

  return (
    <JobDataContext.Provider value={{ 
      jobData, 
      setJobData,
      keywordsData,
      setKeywordsData,
      experienceData,
      setExperienceData,
      coverLetterData,
      setCoverLetterData,
      appliedJobs,
      setAppliedJobs
    }}>
      {children}
    </JobDataContext.Provider>
  );
};

export const useJobData = () => {
  const context = useContext(JobDataContext);
  if (!context) {
    throw new Error('useJobData must be used within a JobDataProvider');
  }
  return context;
};