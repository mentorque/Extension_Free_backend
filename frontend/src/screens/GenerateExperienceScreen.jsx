// frontend/src/screens/GenerateExperienceScreen.jsx
import { useState, useEffect } from 'react';
import { useResume } from '../context/userContext';
import { useJobData } from '../context/jobContext';
import useApi from '../hooks/useApi';
import JobDataWrapper from '../components/JobDataWrapper';
import { GENERATE_EXPERIENCE_URL } from '../constants/index.js';
import { useTheme } from '../context/themeContext.jsx';
import useDailyLimit from '../hooks/useDailyLimit.jsx';
import PremiumLoadingAnimation from '../components/PremiumLoadingAnimation';

const GenerateExperienceScreen = () => {
  const { resumeData } = useResume();
  const { jobData, experienceData, setExperienceData } = useJobData();
  const { theme } = useTheme();
  const { canConsume, consume, isExceeded } = useDailyLimit(100);

  const [loadingText, setLoadingText] = useState('');

  const originalExperience = resumeData?.result?.formatted_resume?.experience || [];

  const body = {
    jobDescription: jobData?.description || '',
    experience: originalExperience
  };

  const { isLoading, error, postData } = useApi(GENERATE_EXPERIENCE_URL);

  const loadingMessages = [
    'Analyzing job requirements...',
    'Reviewing your experience...',
    'Enhancing work descriptions...',
    'Optimizing bullet points...',
    'Almost there...'
  ];

  useEffect(() => {
    if (isLoading) {
      let index = 0;
      setLoadingText(loadingMessages[0]);
      const interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[index]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSave = async () => {
    if (!canConsume) {
      alert('Daily limit reached (20 actions). Try again tomorrow.');
      return;
    }
    if (!consume()) {
      alert('Daily limit reached (20 actions). Try again tomorrow.');
      return;
    }
    
    // Validate data before sending
    if (!body.jobDescription || body.jobDescription.trim() === '') {
      alert('Please provide a job description to generate experience.');
      return;
    }
    
    if (!body.experience || body.experience.length === 0) {
      alert('Please upload your resume first to extract experience.');
      return;
    }
    
    const result = await postData(body);
    if (result) {
      setExperienceData(result.result?.enhanced_experience || []);
    }
  };

  // Modern styling objects
  const containerStyle = {
    minHeight: '100%',
    background: theme.name === 'dark' ? theme.colors.background : 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)',
    padding: '16px',
  };

  const contentStyle = {
    maxWidth: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const headerStyle = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: theme.colors.textPrimary,
    margin: 0,
  };

  const subtitleStyle = {
    color: theme.colors.textSecondary,
    fontSize: '14px',
    maxWidth: '100%',
    margin: '0 auto',
    lineHeight: '1.4',
  };

  const buttonStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    background: isLoading || isExceeded ? '#94a3b8' : theme.colors.primary,
    color: theme.colors.white,
    border: 'none',
    borderRadius: '8px',
    cursor: isLoading || isExceeded ? 'not-allowed' : 'pointer',
    boxShadow: isLoading || isExceeded 
      ? '0 2px 8px rgba(148, 163, 184, 0.3)' 
      : '0 4px 12px rgba(37, 99, 235, 0.3)',
    transition: 'all 0.2s ease',
    transform: isLoading || isExceeded ? 'none' : 'scale(1)',
    minWidth: '200px',
  };

  const errorStyle = {
    background: 'rgba(248,113,113,0.1)',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '24px',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    maxWidth: '600px',
    margin: '0 auto',
  };

  const resultsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const resultsHeaderStyle = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const resultsTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: theme.colors.textPrimary,
    margin: 0,
  };

  const resultsSubtitleStyle = {
    color: theme.colors.textSecondary,
    fontSize: '12px',
    margin: 0,
  };

  const experienceCardStyle = {
    background: theme.colors.background,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    border: `1px solid ${theme.colors.border}`,
  };

  const cardHeaderStyle = {
    background: theme.name === 'dark' ? '#0f172a' : '#1e293b',
    color: theme.colors.white,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const companyTitleStyle = {
    fontSize: '14px',
    fontWeight: '700',
    margin: 0,
    color: theme.colors.white,
  };

  const positionStyle = {
    color: theme.name === 'dark' ? '#94a3b8' : '#cbd5e1',
    fontSize: '12px',
    margin: '2px 0 0 0',
  };

  const comparisonGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 0,
  };

  const beforeSectionStyle = {
    padding: '16px',
    borderRight: `1px solid ${theme.colors.border}`,
  };

  const afterSectionStyle = {
    padding: '16px',
    background: theme.name === 'dark' ? 'rgba(14,165,233,0.08)' : '#f0f9ff',
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '12px',
  };

  const originalBadgeStyle = {
    background: theme.colors.secondaryBackground,
    color: theme.colors.textSecondary,
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '10px',
    fontWeight: '500',
  };

  const enhancedBadgeStyle = {
    background: '#2563eb',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '10px',
    fontWeight: '500',
  };

  const listStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const listItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    color: theme.colors.textSecondary,
    lineHeight: '1.4',
    fontSize: '11px',
  };

  const listItemEnhancedStyle = {
    ...listItemStyle,
    color: theme.colors.textPrimary,
  };

  const bulletStyle = {
    width: '4px',
    height: '4px',
    backgroundColor: theme.colors.border,
    borderRadius: '50%',
    marginTop: '6px',
    flexShrink: 0,
  };

  const bulletEnhancedStyle = {
    ...bulletStyle,
    backgroundColor: theme.colors.primary,
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '16px',
  };

  const emptyStateIconStyle = {
    fontSize: '24px',
    marginBottom: '8px',
    display: 'block',
  };

  const emptyStateTextStyle = {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    margin: 0,
    fontSize: '10px',
  };

  const spinAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <JobDataWrapper>
      <style>{spinAnimation}</style>
      
      {/* Loading Overlay */}
      {isLoading && (
        <PremiumLoadingAnimation 
          loadingText={loadingText} 
          theme={theme} 
          onComplete={() => {
            // Animation completes, but loading state is managed by API hook
            console.log('Loading animation completed');
          }}
        />
      )}
      
      <div style={containerStyle}>
        <div style={contentStyle}>
          {/* Header Section */}
          <div style={headerStyle}>
            <h1 style={titleStyle}>AI Experience Enhancer</h1>
            <p style={subtitleStyle}>
              Transform your work experience descriptions with AI-powered enhancements tailored to your target job.
            </p>
          </div>

          {/* Job Role Display */}
          {jobData?.title && (
            <div style={{
              background: theme.name === 'dark' ? 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.05) 100%)' : 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
              border: '1px solid #93c5fd',
              borderRadius: '6px',
              padding: '8px',
              margin: '0 auto 12px auto',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{
                fontSize: '10px',
                fontWeight: '600',
                color: theme.name === 'dark' ? '#93c5fd' : '#1e40af',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                🎯 Current Job Role
              </div>
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                color: theme.colors.textPrimary,
                lineHeight: '1.4'
              }}>
                {jobData.title}
              </div>
              {jobData.company && (
                <div style={{
                  fontSize: '14px',
                  color: theme.colors.textSecondary,
                  marginTop: '4px'
                }}>
                  at {jobData.company}
                </div>
              )}
            </div>
          )}

          {/* Main Action Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
              <button
                onClick={handleSave}
                disabled={isLoading || isExceeded}
                style={buttonStyle}
                onMouseEnter={(e) => { 
                  if (!isLoading && !isExceeded) {
                    e.target.style.backgroundColor = '#1d4ed8';
                    e.target.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => { 
                  if (!isLoading && !isExceeded) {
                    e.target.style.backgroundColor = '#2563eb';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                {isExceeded ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>🚫</span>
                    <span>Daily limit reached</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>✨</span>
                    <span>Enhance Experience</span>
                  </div>
                )}
              </button>
            </div>

          {/* Error Display */}
          {error && (
            <div style={errorStyle}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>Enhancement Failed</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {experienceData && experienceData.length > 0 && (
            <div style={resultsContainerStyle}>
              <div style={resultsHeaderStyle}>
                <h2 style={resultsTitleStyle}>Enhanced Experience Results</h2>
                <p style={resultsSubtitleStyle}>Compare your original descriptions with AI-enhanced versions</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {originalExperience.map((origEntry, idx) => {
                  const newEntry = experienceData[idx];

                  return (
                    <div key={idx} style={experienceCardStyle}>
                      {/* Job Header */}
                      <div style={cardHeaderStyle}>
                        <span style={{ fontSize: '16px' }}>💼</span>
                        <div>
                          <h3 style={companyTitleStyle}>{origEntry.company || 'Unknown Company'}</h3>
                          <p style={positionStyle}>{origEntry.position || 'Unknown Position'}</p>
                        </div>
                      </div>

                      {/* Before/After Comparison */}
                      <div style={comparisonGridStyle}>
                        {/* Before Section */}
                        <div style={beforeSectionStyle}>
                          <div style={sectionHeaderStyle}>
                            <span style={originalBadgeStyle}>Original</span>
                          </div>

                          {origEntry.description && origEntry.description.length > 0 ? (
                            <ul style={listStyle}>
                              {origEntry.description.map((line, i) => (
                                <li key={i} style={listItemStyle}>
                                  <span style={bulletStyle}></span>
                                  <span>{line}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div style={emptyStateStyle}>
                              <span style={emptyStateIconStyle}>📝</span>
                              <p style={emptyStateTextStyle}>No original experience provided</p>
                            </div>
                          )}
                        </div>

                        {/* After Section */}
                        <div style={afterSectionStyle}>
                          <div style={sectionHeaderStyle}>
                            <span style={enhancedBadgeStyle}>AI Enhanced</span>
                          </div>

                          {newEntry && newEntry.description && newEntry.description.length > 0 ? (
                            <ul style={listStyle}>
                              {newEntry.description.map((line, i) => (
                                <li key={i} style={listItemEnhancedStyle}>
                                  <span style={bulletEnhancedStyle}></span>
                                  <span>{line}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div style={emptyStateStyle}>
                              <span style={emptyStateIconStyle}>🤖</span>
                              <p style={emptyStateTextStyle}>No enhanced experience generated</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </JobDataWrapper>
  );
};

export default GenerateExperienceScreen;