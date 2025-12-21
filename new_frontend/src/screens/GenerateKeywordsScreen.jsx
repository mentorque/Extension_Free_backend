// frontend/src/screens/GenerateKeywordsScreen.jsx
import { useEffect, useRef } from 'react';
import { useResume } from '../context/userContext';
import { useJobData } from '../context/jobContext';
import useApi from '../hooks/useApi';
import JobDataWrapper from '../components/JobDataWrapper';
import { GENERATE_KEYWORDS_URL } from '../constants/index.js';
import { useTheme } from '../context/themeContext.jsx';

const GenerateKeywordsScreen = () => {
  const { resumeData } = useResume();
  const { jobData, keywordsData, setKeywordsData } = useJobData();
  const { theme } = useTheme();
  const previousJobIdRef = useRef(null);

  const { isLoading, error, postData } = useApi(GENERATE_KEYWORDS_URL);

  const handleSave = async () => {
    // Force fresh data - clear any cached keywordsData first
    setKeywordsData(null);
    
    const body = {
      jobDescription: jobData?.description || '',
      skills: resumeData?.result?.formatted_resume?.skills || []
    };
    
    const result = await postData(body);
    if (result) {
      console.log('[Keywords UI] Setting new keywordsData:', result);
      setKeywordsData(result);
    }
  };

  // Automatically analyze keywords when job data changes
  useEffect(() => {
    const currentJobId = jobData?.id || jobData?.description;
    
    // Only trigger if we have both job data and resume data
    if (jobData && jobData.description && resumeData?.result?.formatted_resume?.skills) {
      // Check if this is a different job than the previous one
      if (currentJobId && currentJobId !== previousJobIdRef.current) {
        previousJobIdRef.current = currentJobId;
        handleSave();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobData?.id, jobData?.description, resumeData?.result?.formatted_resume?.skills]);

  // Modern styling objects
  const containerStyle = {
    minHeight: '100%',
    background: theme.name === 'dark' ? theme.colors.background : '#ffffff',
    padding: '12px 16px',
  };

  const contentStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  };

  const cardStyle = {
    padding: '0',
    paddingBottom: '20px',
    marginBottom: '20px',
    borderRadius: '0',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.name === 'dark' ? '#374151' : '#e5e7eb'}`,
  };

  const lastCardStyle = {
    padding: '0',
    borderRadius: '0',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  };

  const skillsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px 16px',
    padding: '8px 0',
  };

  const skillItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0',
    fontSize: '14px',
    fontWeight: '400',
    color: theme.colors.textPrimary,
    minWidth: 0,
  };

  const matchingSkillStyle = {
    ...skillItemStyle,
  };

  const missingSkillStyle = {
    ...skillItemStyle,
  };

  const checkIconStyle = {
    flexShrink: 0,
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
  };

  const matchingCheckIconStyle = {
    ...checkIconStyle,
    backgroundColor: '#60d5ec',
  };

  const missingCheckIconStyle = {
    ...checkIconStyle,
    backgroundColor: theme.name === 'dark' ? '#4b5563' : '#9ca3af',
  };

  const errorStyle = {
    background: 'transparent',
    border: 'none',
    borderRadius: '0',
    padding: '12px 0',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  };

  const bounceAnimation = `
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0,0,0);
      }
      40%, 43% {
        transform: translate3d(0, -8px, 0);
      }
      70% {
        transform: translate3d(0, -4px, 0);
      }
      90% {
        transform: translate3d(0, -2px, 0);
      }
    }
  `;

  const scrollbarStyles = `
    /* Hide scrollbar by default, show only on hover */
    span::-webkit-scrollbar {
      height: 2px;
    }
    span::-webkit-scrollbar-track {
      background: transparent;
    }
    span::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 4px;
    }
    span:hover::-webkit-scrollbar-thumb {
      background: #cbd5e1;
    }
    span {
      scrollbar-width: none; /* Firefox */
    }
    span:hover {
      scrollbar-width: thin; /* Firefox */
    }
  `;

  // Use ACTUAL counts from backend (not displayed array lengths)
  // present_count = actual number of matched keywords (not limited by display)
  // total_important_keywords = total important keywords from JD
  const presentSkills = keywordsData?.result?.present_skills || [];
  const missingSkills = keywordsData?.result?.missing_skills || [];

  const presentCount = presentSkills.length;
  const totalImportantKeywords = presentSkills.length + missingSkills.length;
  
  const matchPercentage = totalImportantKeywords > 0
    ? Math.round((presentCount / totalImportantKeywords) * 100)
    : 0;
  
  // Debug logging - ALWAYS log to help debug
  console.log('[Keywords UI] Current keywordsData:', keywordsData?.result);
  console.log('[Keywords UI] Calculated values:', {
    presentCount,
    totalImportantKeywords,
    matchPercentage,
    backend_present_count: keywordsData?.result?.present_count,
    backend_total: keywordsData?.result?.total_important_keywords,
    backend_percentage: keywordsData?.result?.match_percentage,
    present_skills_length: presentSkills.length,
    missing_skills_length: missingSkills.length
  });
  
  const getMatchStatus = (percentage) => {
    if (percentage >= 70) return { text: 'Excellent', color: '#10b981' };
    if (percentage >= 50) return { text: 'Good', color: '#f59e0b' };
    return { text: 'Needs Work', color: '#f59e0b' };
  };

  const matchStatus = getMatchStatus(matchPercentage);

  return (
    <JobDataWrapper>
      <style>{bounceAnimation}{scrollbarStyles}</style>
      
      <div style={containerStyle}>
        <div style={contentStyle}>
          {/* Loading indicator */}
          {isLoading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '8px',
              padding: '16px',
              background: 'transparent',
              borderRadius: '0',
              border: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: theme.colors.primary,
                  borderRadius: '50%',
                  animation: 'bounce 1.4s ease-in-out infinite',
                  animationDelay: '-0.3s'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: theme.colors.primary,
                  borderRadius: '50%',
                  animation: 'bounce 1.4s ease-in-out infinite',
                  animationDelay: '-0.15s'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: theme.colors.primary,
                  borderRadius: '50%',
                  animation: 'bounce 1.4s ease-in-out infinite'
                }}></div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div style={errorStyle}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Keywords Section */}
          {keywordsData && (
            <>
              {/* Match Status Card */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#60d5ec',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <h2 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: theme.colors.textPrimary,
                    margin: 0 
                  }}>
                    Keyword Match - <span style={{ color: matchStatus.color }}>{matchStatus.text}</span>
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '14px', 
                      color: theme.colors.textPrimary,
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      Your resume has <strong>{presentCount} out of {totalImportantKeywords} ({matchPercentage}%)</strong> important keywords from the job description.
                    </p>
                  </div>
                  
                  {/* Semi-circular gauge */}
                  <div style={{ position: 'relative', width: '120px', height: '70px', marginLeft: '20px' }}>
                    <svg width="120" height="70" viewBox="0 0 120 70">
                      {/* Background arc */}
                      <path
                        d="M 10 60 A 50 50 0 0 1 110 60"
                        fill="none"
                        stroke={theme.name === 'dark' ? '#374151' : '#e5e7eb'}
                        strokeWidth="12"
                        strokeLinecap="round"
                      />
                      {/* Progress arc */}
                      <path
                        d="M 10 60 A 50 50 0 0 1 110 60"
                        fill="none"
                        stroke={matchPercentage >= 70 ? '#10b981' : matchPercentage >= 50 ? '#60d5ec' : '#ef4444'}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(matchPercentage / 100) * 157} 157`}
                      />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -20%)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Tip Section */}
                {matchPercentage < 70 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 0',
                    backgroundColor: 'transparent',
                    borderRadius: '0',
                    border: 'none'
                  }}>
                    <span style={{ fontSize: '24px' }}>💡</span>
                    <p style={{
                      fontSize: '14px',
                      color: theme.colors.textPrimary,
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      Try to get your score above <strong>70%</strong> to increase your chances!
                    </p>
                  </div>
                )}
              </div>

              {/* Keywords Card - Single Section */}
              <div style={lastCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: theme.colors.textPrimary,
                      margin: 0 
                    }}>
                      Important Keywords
                    </h3>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: theme.name === 'dark' ? '#4b5563' : '#9ca3af',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: 'white',
                      fontWeight: '700',
                      cursor: 'help',
                      title: 'Important technical skills and keywords extracted from the job description'
                    }}>
                      ?
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    backgroundColor: theme.name === 'dark' ? 'rgba(96,213,236,0.1)' : '#e0f7fc',
                    border: 'none'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="#60d5ec">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#60d5ec' }}>
                      {presentCount}/{totalImportantKeywords}
                    </span>
                  </div>
                </div>

                {/* Keywords in 2-column layout */}
                {totalImportantKeywords > 0 ? (
                  <div style={skillsGridStyle}>
                    {/* Matching Skills - Show first */}
                    {presentSkills.map((skill, index) => (
                      <div key={`present-${index}`} style={matchingSkillStyle}>
                        <div style={matchingCheckIconStyle}>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        </div>
                        <span style={{ 
                          flex: 1, 
                          minWidth: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'auto',
                          textOverflow: 'clip',
                          scrollbarWidth: 'thin',
                        }}>
                          {skill}
                        </span>
                      </div>
                    ))}
                    
                    {/* Missing Skills - Show after matching ones */}
                    {missingSkills.map((skill, index) => (
                      <div key={`missing-${index}`} style={missingSkillStyle}>
                        <div style={missingCheckIconStyle}>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        </div>
                        <span style={{ 
                          flex: 1,
                          minWidth: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'auto',
                          textOverflow: 'clip',
                          scrollbarWidth: 'thin',
                        }}>
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{
                    fontSize: '14px',
                    color: theme.colors.textSecondary || '#6b7280',
                    margin: '8px 0 0 0',
                    fontStyle: 'italic'
                  }}>
                    No important keywords found in this job description.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </JobDataWrapper>
  );
};

export default GenerateKeywordsScreen;
