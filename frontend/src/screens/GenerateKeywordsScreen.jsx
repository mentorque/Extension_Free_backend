// frontend/src/screens/GenerateKeywordsScreen.jsx
import { useEffect, useRef, useState } from 'react';
import { useResume } from '../context/userContext';
import { useJobData } from '../context/jobContext';
import { useRequest } from '../context/requestContext';
import useApi from '../hooks/useApi';
import JobDataWrapper from '../components/JobDataWrapper';
import UserInfoForm from '../components/UserInfoForm';
import AdScreen from '../components/AdScreen';
import { GENERATE_KEYWORDS_URL } from '../constants/index.js';
import { useTheme } from '../context/themeContext.jsx';

const GenerateKeywordsScreen = () => {
  const { resumeData } = useResume();
  const { jobData, keywordsData, setKeywordsData } = useJobData();
  const { theme } = useTheme();
  const { incrementKeywordRequest, shouldShowForm, shouldShowAd, isFormSubmitted, markFormSubmitted } = useRequest();
  const previousJobIdRef = useRef(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const { isLoading, error, postData } = useApi(GENERATE_KEYWORDS_URL);

  const handleSave = async () => {
    // Check if form should be shown (after 2 requests)
    if (shouldShowForm() && !isFormSubmitted) {
      setShowUserForm(true);
      return; // Block request until form is submitted
    }

    // Check if form is submitted - if not, don't allow requests
    if (!isFormSubmitted) {
      // Allow first 2 requests without form
      const currentCount = parseInt(localStorage.getItem('keywordRequestCount') || '0', 10);
      if (currentCount >= 2) {
        // After 2 requests, form is required
        setShowUserForm(true);
        return;
      }
    }

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
      
      // Increment request count AFTER successful request
      const newCount = incrementKeywordRequest();
      
      // Check if we should show ad (after every 10 requests)
      // Use setTimeout to show ad after a brief delay so user sees the results first
      setTimeout(() => {
        const currentCount = parseInt(localStorage.getItem('keywordRequestCount') || '0', 10);
        if (currentCount > 0 && currentCount % 10 === 0) {
          setShowAd(true);
        }
      }, 1000);
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
    padding: '8px 12px',
  };

  const contentStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  };

  const cardStyle = {
    padding: '0',
    paddingBottom: '16px',
    marginBottom: '16px',
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
    gap: '6px 12px',
    padding: '4px 0',
  };

  const skillItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0',
    fontSize: '13px',
    fontWeight: '400',
    color: theme.colors.textPrimary,
    minWidth: 0,
    lineHeight: '1.4',
  };

  const matchingSkillStyle = {
    ...skillItemStyle,
  };

  const missingSkillStyle = {
    ...skillItemStyle,
  };

  const checkIconStyle = {
    flexShrink: 0,
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
  };

  const matchingCheckIconStyle = {
    ...checkIconStyle,
    backgroundColor: theme.colors.primary, // Mentorque blue
  };

  const missingCheckIconStyle = {
    ...checkIconStyle,
    backgroundColor: '#ef4444', // Red color for missing/wrong skills
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

  // Frontend blacklist: Terms that should NEVER be shown as Important keywords
  // Convert all to lowercase for case-insensitive matching
  const IMPORTANT_KEYWORDS_BLACKLIST = new Set([
    "computer science", "cs", "information technology", "it",
    "software development", "web development", "application development",
    "programming", "coding", "code", "codes", "coded", "coder", "coders",
    "software engineering", "code review", "code reviews",
    "technical skills", "technical knowledge", "technical writing",
    "research papers", "research paper", "research papers writing", "research papers writing service"
  ].map(term => term.toLowerCase()));

  // Helper function to check if a skill is blacklisted (case-insensitive)
  const isBlacklisted = (skill) => {
    if (!skill) return false;
    const skillLower = String(skill).toLowerCase().trim();
    // Check exact match and also check if skill contains any blacklisted term
    if (IMPORTANT_KEYWORDS_BLACKLIST.has(skillLower)) {
      return true;
    }
    // Also check if skill contains any blacklisted term as substring
    for (const blacklistedTerm of IMPORTANT_KEYWORDS_BLACKLIST) {
      if (skillLower.includes(blacklistedTerm) || blacklistedTerm.includes(skillLower)) {
        return true;
      }
    }
    return false;
  };

  // Filter function to remove blacklisted items
  const filterBlacklisted = (skills) => {
    return skills.filter(skill => !isBlacklisted(skill));
  };

  // Use bifurcated structure if available, otherwise fall back to old structure
  const isBifurcated = keywordsData?.result?.bifurcated === true;
  
  // Get skills from response - Support all three categories
  let importantPresentSkills = keywordsData?.result?.important_present_skills || [];
  let importantMissingSkills = keywordsData?.result?.important_missing_skills || [];
  const lessImportantPresentSkills = keywordsData?.result?.less_important_present_skills || [];
  const lessImportantMissingSkills = keywordsData?.result?.less_important_missing_skills || [];
  const nonTechnicalPresentSkills = keywordsData?.result?.non_technical_present_skills || [];
  const nonTechnicalMissingSkills = keywordsData?.result?.non_technical_missing_skills || [];
  
  // Apply frontend blacklist filter to important skills
  importantPresentSkills = filterBlacklisted(importantPresentSkills);
  importantMissingSkills = filterBlacklisted(importantMissingSkills);
  
  // Log filtered items for debugging
  const filteredPresent = (keywordsData?.result?.important_present_skills || []).filter(isBlacklisted);
  const filteredMissing = (keywordsData?.result?.important_missing_skills || []).filter(isBlacklisted);
  if (filteredPresent.length > 0 || filteredMissing.length > 0) {
    console.log('[Frontend] 🚫 Filtered blacklisted items from Important:', {
      present: filteredPresent,
      missing: filteredMissing
    });
  }
  
  // Fallback to old structure if not bifurcated
  const presentSkills = isBifurcated 
    ? [...importantPresentSkills, ...lessImportantPresentSkills]
    : filterBlacklisted(keywordsData?.result?.present_skills || []);
  const missingSkills = isBifurcated
    ? [...importantMissingSkills, ...lessImportantMissingSkills]
    : filterBlacklisted(keywordsData?.result?.missing_skills || []);

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
    if (percentage >= 50) return { text: 'Good', color: '#10b981' }; // Green for Good
    return { text: 'Needs Work', color: '#f59e0b' };
  };

  const matchStatus = getMatchStatus(matchPercentage);

  const spinAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.05); }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    @keyframes skeleton-loading {
      0% { opacity: 1; }
      50% { opacity: 0.4; }
      100% { opacity: 1; }
    }
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `;

  return (
    <>
      {showUserForm && (
        <UserInfoForm
          required={shouldShowForm()}
          onClose={() => {
            if (shouldShowForm()) {
              return; // Don't allow closing if form is required
            }
            setShowUserForm(false);
          }}
          onSuccess={(userData) => {
            markFormSubmitted();
            setShowUserForm(false);
          }}
        />
      )}
      
      {showAd && (
        <AdScreen onClose={() => setShowAd(false)} />
      )}

      <JobDataWrapper>
        <style>{bounceAnimation}{scrollbarStyles}{spinAnimation}</style>
        
        <div style={containerStyle}>
        <div style={contentStyle}>
          
          {/* Skeleton Loading State - Matches exact content structure */}
          {isLoading && !keywordsData && (
            <>
              {/* Skeleton: Match Status Card */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  {/* Skeleton: Icon */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                    animation: 'skeleton-loading 1.5s ease-in-out infinite'
                  }} />
                  {/* Skeleton: Heading */}
                  <div style={{
                    height: '22px',
                    width: '200px',
                    borderRadius: '4px',
                    backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                    animation: 'skeleton-loading 1.5s ease-in-out infinite'
                  }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  {/* Skeleton: Text */}
                  <div style={{
                    height: '20px',
                    width: '180px',
                    borderRadius: '4px',
                    backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                    animation: 'skeleton-loading 1.5s ease-in-out infinite'
                  }} />
                  
                  {/* Skeleton: Gauge */}
                  <div style={{ 
                    position: 'relative', 
                    width: '120px', 
                    height: '70px', 
                    marginLeft: '20px',
                    borderRadius: '4px',
                    backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                    animation: 'skeleton-loading 1.5s ease-in-out infinite'
                  }} />
                </div>
              </div>

              {/* Skeleton: Tip Section */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 0',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                  animation: 'skeleton-loading 1.5s ease-in-out infinite'
                }} />
                <div style={{
                  height: '18px',
                  width: '220px',
                  borderRadius: '4px',
                  backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                  animation: 'skeleton-loading 1.5s ease-in-out infinite'
                }} />
              </div>

              {/* Skeleton: Important Keywords Section */}
              <div style={lastCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Skeleton: Heading */}
                    <div style={{
                      height: '20px',
                      width: '150px',
                      borderRadius: '4px',
                      backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                      animation: 'skeleton-loading 1.5s ease-in-out infinite'
                    }} />
                    {/* Skeleton: Help icon */}
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                      animation: 'skeleton-loading 1.5s ease-in-out infinite'
                    }} />
                  </div>
                  {/* Skeleton: Badge */}
                  <div style={{
                    height: '24px',
                    width: '60px',
                    borderRadius: '12px',
                    backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                    animation: 'skeleton-loading 1.5s ease-in-out infinite'
                  }} />
                </div>

                {/* Skeleton: Skills Grid */}
                <div style={skillsGridStyle}>
                  {[90, 110, 85, 120, 95, 105, 100, 115].map((width, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0'
                    }}>
                      {/* Skeleton: Icon */}
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                        animation: 'skeleton-loading 1.5s ease-in-out infinite',
                        animationDelay: `${index * 0.1}s`
                      }} />
                      {/* Skeleton: Skill text */}
                      <div style={{
                        height: '18px',
                        width: `${width}px`,
                        borderRadius: '4px',
                        backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                        animation: 'skeleton-loading 1.5s ease-in-out infinite',
                        animationDelay: `${index * 0.1}s`
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Skeleton: Less Important Keywords Section */}
              <div style={lastCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Skeleton: Heading */}
                    <div style={{
                      height: '18px',
                      width: '160px',
                      borderRadius: '4px',
                      backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                      animation: 'skeleton-loading 1.5s ease-in-out infinite'
                    }} />
                    {/* Skeleton: Help icon */}
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                      animation: 'skeleton-loading 1.5s ease-in-out infinite'
                    }} />
                  </div>
                  {/* Skeleton: Badge */}
                  <div style={{
                    height: '24px',
                    width: '50px',
                    borderRadius: '12px',
                    backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                    animation: 'skeleton-loading 1.5s ease-in-out infinite'
                  }} />
                </div>

                {/* Skeleton: Skills Grid */}
                <div style={skillsGridStyle}>
                  {[75, 95, 80, 100, 85, 90].map((width, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0'
                    }}>
                      {/* Skeleton: Icon */}
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                        animation: 'skeleton-loading 1.5s ease-in-out infinite',
                        animationDelay: `${index * 0.1}s`
                      }} />
                      {/* Skeleton: Skill text */}
                      <div style={{
                        height: '18px',
                        width: `${width}px`,
                        borderRadius: '4px',
                        backgroundColor: theme.name === 'dark' ? '#374151' : '#e5e7eb',
                        animation: 'skeleton-loading 1.5s ease-in-out infinite',
                        animationDelay: `${index * 0.1}s`
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </>
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
              {/* Subtle refresh indicator when updating */}
              {isLoading && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  marginBottom: '12px',
                  backgroundColor: theme.name === 'dark' ? 'rgba(96,213,236,0.1)' : '#e0f7fc',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: theme.colors.textSecondary
                }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    border: `2px solid ${theme.name === 'dark' ? '#374151' : '#e5e7eb'}`,
                    borderTop: `2px solid ${theme.colors.primary || '#60d5ec'}`,
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  <span>Refreshing analysis...</span>
                </div>
              )}
              
              {/* Match Status Card */}
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary, // Mentorque blue
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="white">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <h2 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: theme.colors.textPrimary,
                    margin: 0 
                  }}>
                    Keyword Match - <span style={{ color: matchStatus.color }}>{matchStatus.text}</span>
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '13px', 
                      color: theme.colors.textPrimary,
                      lineHeight: '1.4',
                      margin: 0
                    }}>
                      <strong>{presentCount}/{totalImportantKeywords} ({matchPercentage}%)</strong> keywords matched
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
              </div>

                {/* Tip Section */}
                {matchPercentage < 70 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 0',
                    backgroundColor: 'transparent',
                    borderRadius: '0',
                    border: 'none'
                  }}>
                    <span style={{ fontSize: '18px' }}>💡</span>
                    <p style={{
                      fontSize: '13px',
                      color: theme.colors.textSecondary,
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      Aim for <strong>70%+</strong> to improve your chances
                    </p>
                  </div>
                )}

              {/* Keywords Card - Two Sections: Important and Less Important */}
              
              {/* Important Keywords Section */}
              {(isBifurcated ? (importantPresentSkills.length > 0 || importantMissingSkills.length > 0) : totalImportantKeywords > 0) && (
                <div style={lastCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: theme.colors.textPrimary,
                        margin: 0,
                        lineHeight: '1.3'
                      }}>
                        Important Keywords
                      </h3>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: theme.name === 'dark' ? '#4b5563' : '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: 'white',
                        fontWeight: '700',
                        cursor: 'help',
                        title: 'High-priority technical skills and keywords from the job description',
                        flexShrink: 0
                      }}>
                        ?
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '10px',
                      backgroundColor: theme.name === 'dark' ? `${theme.colors.primary}20` : `${theme.colors.primary}15`,
                      border: 'none'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 20 20" fill={theme.colors.primary}>
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: theme.colors.primary }}>
                        {isBifurcated ? importantPresentSkills.length : presentCount}/{isBifurcated ? (importantPresentSkills.length + importantMissingSkills.length) : totalImportantKeywords}
                      </span>
                    </div>
                  </div>

                  {/* Important Keywords in 2-column layout */}
                  <div style={skillsGridStyle}>
                    {/* Important Present Skills */}
                    {isBifurcated ? importantPresentSkills.map((skill, index) => (
                      <div key={`important-present-${index}`} style={matchingSkillStyle}>
                        <div style={matchingCheckIconStyle}>
                          <svg width="10" height="10" viewBox="0 0 20 20" fill="white">
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
                    )) : presentSkills.map((skill, index) => (
                      <div key={`present-${index}`} style={matchingSkillStyle}>
                        <div style={matchingCheckIconStyle}>
                          <svg width="10" height="10" viewBox="0 0 20 20" fill="white">
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

                    {/* Important Missing Skills */}
                    {isBifurcated ? importantMissingSkills.map((skill, index) => (
                      <div key={`important-missing-${index}`} style={missingSkillStyle}>
                        <div style={missingCheckIconStyle}>
                          <svg width="12" height="12" viewBox="0 0 20 20" fill="white">
                            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
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
                    )) : missingSkills.map((skill, index) => (
                      <div key={`missing-${index}`} style={missingSkillStyle}>
                        <div style={missingCheckIconStyle}>
                          <svg width="12" height="12" viewBox="0 0 20 20" fill="white">
                            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
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
                </div>
              )}

              {/* Less Important Keywords Section */}
              {isBifurcated && (lessImportantPresentSkills.length > 0 || lessImportantMissingSkills.length > 0) && (
                <div style={{...lastCardStyle, paddingTop: '8px'}}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: theme.colors.textSecondary,
                        margin: 0,
                        lineHeight: '1.3'
                      }}>
                        Less Important Keywords
                      </h3>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: theme.name === 'dark' ? '#4b5563' : '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: 'white',
                        fontWeight: '700',
                        cursor: 'help',
                        title: 'Additional skills and keywords that are nice to have',
                        flexShrink: 0
                      }}>
                        ?
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '10px',
                      backgroundColor: theme.name === 'dark' ? 'rgba(156,163,175,0.1)' : '#f3f4f6',
                      border: 'none'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="#9ca3af">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#9ca3af' }}>
                        {lessImportantPresentSkills.length}/{lessImportantPresentSkills.length + lessImportantMissingSkills.length}
                      </span>
                    </div>
                  </div>

                  {/* Less Important Keywords in 2-column layout */}
                  <div style={skillsGridStyle}>
                    {/* Less Important Present Skills */}
                    {lessImportantPresentSkills.map((skill, index) => (
                      <div key={`less-important-present-${index}`} style={matchingSkillStyle}>
                        <div style={matchingCheckIconStyle}>
                          <svg width="10" height="10" viewBox="0 0 20 20" fill="white">
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

                    {/* Less Important Missing Skills */}
                    {lessImportantMissingSkills.map((skill, index) => (
                      <div key={`less-important-missing-${index}`} style={missingSkillStyle}>
                        <div style={missingCheckIconStyle}>
                          <svg width="12" height="12" viewBox="0 0 20 20" fill="white">
                            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
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
                </div>
              )}

              {/* Non-Technical Keywords Section */}
              {isBifurcated && (nonTechnicalPresentSkills.length > 0 || nonTechnicalMissingSkills.length > 0) && (
                <div style={{...lastCardStyle, paddingTop: '8px', marginTop: '12px'}}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: theme.colors.textSecondary,
                        margin: 0,
                        lineHeight: '1.3'
                      }}>
                        Non-Technical Keywords
                      </h3>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: theme.name === 'dark' ? '#6b7280' : '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: 'white',
                        fontWeight: '700',
                        cursor: 'help',
                        title: 'Non-technical skills and keywords from the job description',
                        flexShrink: 0
                      }}>
                        ?
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '10px',
                      backgroundColor: theme.name === 'dark' ? 'rgba(107,114,128,0.2)' : 'rgba(107,114,128,0.15)',
                      border: 'none'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="#6b7280">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                        {nonTechnicalPresentSkills.length}/{nonTechnicalPresentSkills.length + nonTechnicalMissingSkills.length}
                      </span>
                    </div>
                  </div>

                  {/* Non-Technical Keywords in 2-column layout */}
                  <div style={skillsGridStyle}>
                    {/* Non-Technical Present Skills */}
                    {nonTechnicalPresentSkills.map((skill, index) => (
                      <div key={`non-technical-present-${index}`} style={{
                        ...matchingSkillStyle,
                        backgroundColor: theme.name === 'dark' ? 'rgba(107,114,128,0.1)' : '#f3f4f6',
                        borderColor: theme.name === 'dark' ? 'rgba(107,114,128,0.2)' : '#d1d5db'
                      }}>
                        <div style={{
                          ...matchingCheckIconStyle,
                          backgroundColor: '#6b7280'
                        }}>
                          <svg width="10" height="10" viewBox="0 0 20 20" fill="white">
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
                          color: theme.colors.textSecondary
                        }}>
                          {skill}
                        </span>
                      </div>
                    ))}

                    {/* Non-Technical Missing Skills */}
                    {nonTechnicalMissingSkills.map((skill, index) => (
                      <div key={`non-technical-missing-${index}`} style={{
                        ...missingSkillStyle,
                        backgroundColor: theme.name === 'dark' ? 'rgba(107,114,128,0.05)' : '#f9fafb',
                        borderColor: theme.name === 'dark' ? 'rgba(107,114,128,0.1)' : '#e5e7eb'
                      }}>
                        <div style={{
                          ...missingCheckIconStyle,
                          backgroundColor: '#9ca3af'
                        }}>
                          <svg width="12" height="12" viewBox="0 0 20 20" fill="white">
                            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                          </svg>
                        </div>
                        <span style={{ 
                          flex: 1,
                          minWidth: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'auto',
                          textOverflow: 'clip',
                          scrollbarWidth: 'thin',
                          color: theme.colors.textSecondary
                        }}>
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </JobDataWrapper>
    </>
  );
};

export default GenerateKeywordsScreen;
