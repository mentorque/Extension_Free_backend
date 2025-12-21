// frontend/src/screens/displayUserData.jsx
import { useJobData } from "../context/jobContext";
import { useResume } from "../context/userContext";
import { useAuth } from "../context/authContext.jsx";
import { useEffect, useState, useCallback, memo } from "react";
import { Briefcase, User, FileText, Star, ChevronDown, ChevronUp, CheckCircle, Circle, Upload, Building2 } from "lucide-react";
import JobDataWrapper from "../components/JobDataWrapper";
import { useTheme } from "../context/themeContext.jsx";

const SectionHeader = memo(({ icon: Icon, title, isExpanded, onToggle, gradientFrom, gradientTo }) => {
  const { theme } = useTheme();
  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
      aria-expanded={isExpanded}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        cursor: 'pointer',
        borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        backgroundImage: theme.name === 'dark' ? 'none' : 'linear-gradient(to right, #f8fafc, #f1f5f9)',
        backgroundColor: theme.name === 'dark' ? theme.colors.secondaryBackground : undefined,
        transition: 'background 0.2s ease-in-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            padding: '8px',
            borderRadius: '8px',
            backgroundImage: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
          }}
        >
          <Icon style={{ height: '20px', width: '20px', color: 'white' }} />
        </div>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: '4px', borderRadius: '9999px' }}>
        {isExpanded ? (
          <ChevronUp style={{ height: '20px', width: '20px', color: theme.colors.textSecondary }} />
        ) : (
          <ChevronDown style={{ height: '20px', width: '20px', color: theme.colors.textSecondary }} />
        )}
      </div>
    </div>
  );
});

const JobRequirementItem = memo(({ children, isRequirement = false }) => {
  const { theme } = useTheme();
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
      <div style={{ marginTop: '2px', flexShrink: 0 }}>
        {isRequirement ? (
          <CheckCircle style={{ height: '16px', width: '16px', color: '#10b981' }} />
        ) : (
          <Circle style={{ height: '16px', width: '16px', color: theme.colors.primary }} />
        )}
      </div>
      <span style={{ fontSize: '13px', color: theme.colors.textPrimary, lineHeight: 1.6 }}>{children}</span>
    </li>
  );
});

const SectionContent = memo(({ children, style }) => {
  const { theme } = useTheme();
  return (
    <div
      style={{
        padding: '24px',
        maxHeight: '384px',
        overflowY: 'auto',
        background: theme.colors.background,
        ...style
      }}
    >
      {children}
    </div>
  );
});

const ResumeViewer = () => {
  const { resumeData } = useResume();
  const { jobData } = useJobData();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState({
    jobDescription: false,
    resumeData: true
  });

  // Frontend blacklist: Terms that should NEVER be shown as Important skills
  // Convert all to lowercase for case-insensitive matching
  const IMPORTANT_KEYWORDS_BLACKLIST = new Set([
    "computer science", "cs", "information technology", "it",
    "software development", "web development", "application development",
    "programming", "coding", "code", "codes", "coded", "coder", "coders",
    "software engineering", "code review", "code reviews",
    "technical skills", "technical knowledge", "technical writing",
    "research papers", "research paper", "research papers writing", "research papers writing service"
  ].map(term => term.toLowerCase()));

  // Helper function to check if a skill is blacklisted (case-insensitive with substring matching)
  const isBlacklisted = (skill) => {
    if (!skill) return false;
    const skillLower = String(skill).toLowerCase().trim();
    // Check exact match
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

  // Helper function to filter blacklisted skills
  const filterBlacklistedSkills = (skills) => {
    if (!Array.isArray(skills)) return skills;
    return skills.filter(skill => !isBlacklisted(skill));
  };

  // Filter resume skills if they exist
  const filteredResumeData = resumeData?.result?.formatted_resume ? {
    ...resumeData.result.formatted_resume,
    skills: filterBlacklistedSkills(resumeData.result.formatted_resume.skills)
  } : null;

  useEffect(() => {
    console.log("Job Data:", jobData);
  }, [jobData]);

  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const formatJobDescription = useCallback((description) => {
    if (!description) {
      return (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <FileText style={{ height: '48px', width: '48px', color: '#cbd5e1', margin: '0 auto 12px' }} />
          <p style={{ color: theme.colors.textSecondary, fontStyle: 'italic' }}>No job description available.</p>
        </div>
      );
    }

    const sections = description.split(/(\n\s*(?:About|Requirements|Responsibilities|Benefits|Qualifications|Skills|Experience):?\s*\n)/i);

    const formattedContent = [];
    let currentHeader = '';
    for (let i = 0; i < sections.length; i++) {
      const sectionText = sections[i];

      if (sectionText.match(/\n\s*(?:About|Requirements|Responsibilities|Benefits|Qualifications|Skills|Experience):?\s*\n/i)) {
        const headerMatch = sectionText.match(/(About|Requirements|Responsibilities|Benefits|Qualifications|Skills|Experience):?/i);
        if (headerMatch) {
          currentHeader = headerMatch[1] || '';
          formattedContent.push(
            <div key={`header-${i}`} style={{ marginTop: '24px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px', borderBottom: `1px solid ${theme.colors.border}` }}>
                <Star style={{ height: '16px', width: '16px', color: '#f59e0b' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: theme.colors.textPrimary, margin: 0 }}>{headerMatch[1]}</h4>
              </div>
            </div>
          );
        }
      } else {
        const lines = sectionText.split('\n').filter((line) => line.trim());
        if (lines.length > 0) {
          const isList = lines.some((line) => line.trim().match(/^[•*-]\s*/));
          const isRequirementSection = /requirement/i.test(currentHeader);

          if (isList) {
            formattedContent.push(
              <ul key={`list-${i}`} style={{ marginBottom: '12px', paddingLeft: 0, listStyle: 'none' }}>
                {lines.map((line, lineIndex) => (
                  <JobRequirementItem key={`list-item-${i}-${lineIndex}`} isRequirement={isRequirementSection}>
                    {line.replace(/^[•*-]\s*/, '').trim()}
                  </JobRequirementItem>
                ))}
              </ul>
            );
          } else {
            formattedContent.push(
              <div key={`paragraph-block-${i}`} style={{ marginBottom: '12px' }}>
                {lines.map((line, lineIndex) => (
                  <p key={`paragraph-${i}-${lineIndex}`} style={{ fontSize: '13px', color: theme.colors.textPrimary, lineHeight: 1.6, margin: 0 }}>
                    {line.trim()}
                  </p>
                ))}
              </div>
            );
          }
        }
      }
    }
    return formattedContent;
  }, []);

  const formatResumeData = useCallback((data) => {
    if (!data) {
      return (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Upload style={{ height: '64px', width: '64px', color: '#cbd5e1', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: theme.colors.textPrimary, marginBottom: '8px' }}>No Resume Data</h3>
          <p style={{ color: theme.colors.textSecondary }}>Upload your resume to see detailed analysis and matching.</p>
        </div>
      );
    }

    const resume = data.formatted_resume || data;
    const skills = resume.skills || [];
    const skillsClassified = resume.skills_classified || {};
    const importantSkills = skillsClassified.important_skills || skills || [];
    const lessImportantSkills = skillsClassified.less_important_skills || [];
    const nonTechnicalSkills = skillsClassified.non_technical_skills || [];

    const renderValue = (value, indentLevel = 0) => {
      if (Array.isArray(value)) {
        return (
          <ul style={{ listStyle: 'none', paddingLeft: indentLevel > 0 ? '16px' : 0, margin: 0 }}>
            {value.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                <Circle style={{ height: '12px', width: '12px', color: theme.colors.primary, marginTop: '4px', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: theme.colors.textPrimary, lineHeight: 1.6 }}>
                  {typeof item === 'object' && item !== null ? renderValue(item, indentLevel + 1) : String(item)}
                </span>
              </li>
            ))}
          </ul>
        );
      } else if (typeof value === 'object' && value !== null) {
        return (
          <div style={{ paddingLeft: indentLevel > 0 ? '16px' : 0, marginLeft: indentLevel > 0 ? '16px' : 0, borderLeft: indentLevel > 0 ? `2px solid ${theme.colors.border}` : 'none' }}>
            {Object.entries(value).map(([subKey, subValue]) => (
              <div key={subKey} style={{ marginBottom: '12px' }}>
                <h5 style={{ fontSize: '13px', fontWeight: 600, color: theme.colors.textPrimary, margin: '0 0 4px 0' }}>
                  {subKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </h5>
                {renderValue(subValue, indentLevel + 1)}
              </div>
            ))}
          </div>
        );
      } else {
        return <span style={{ fontSize: '13px', color: theme.colors.textPrimary, lineHeight: 1.6 }}>{String(value)}</span>;
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Skills Section - Compact Horizontal Layout */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: 600, 
                color: theme.colors.textPrimary, 
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ 
                  width: '5px', 
                  height: '5px', 
                  background: '#60d5ec', 
                  borderRadius: '50%', 
                  display: 'inline-block' 
                }} />
                Skills
              </h4>
              <div style={{
                fontSize: '11px',
                color: theme.colors.textSecondary,
                fontWeight: 500
              }}>
                {importantSkills.length}
              </div>
            </div>
            
            {/* Skills Grid - Compact Horizontal Layout */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '16px'
            }}>
              {importantSkills.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: theme.name === 'dark' 
                      ? 'rgba(96,213,236,0.1)' 
                      : '#e0f7fc',
                    border: `1px solid ${theme.name === 'dark' ? 'rgba(96,213,236,0.2)' : '#b3e5fc'}`,
                    fontSize: '12px',
                    fontWeight: 500,
                    color: theme.colors.textPrimary,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    cursor: 'default',
                    lineHeight: '1.4'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = theme.name === 'dark' 
                      ? '0 2px 8px rgba(96,213,236,0.2)' 
                      : '0 2px 8px rgba(96,213,236,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>

            {/* Less Important & Non-Technical Skills (Collapsible) */}
            {(lessImportantSkills.length > 0 || nonTechnicalSkills.length > 0) && (
              <details style={{ marginTop: '12px' }}>
                <summary style={{
                  fontSize: '13px',
                  color: theme.colors.textSecondary,
                  cursor: 'pointer',
                  fontWeight: 500,
                  padding: '8px 0',
                  userSelect: 'none'
                }}>
                  {lessImportantSkills.length > 0 && `${lessImportantSkills.length} less important`}
                  {lessImportantSkills.length > 0 && nonTechnicalSkills.length > 0 && ' • '}
                  {nonTechnicalSkills.length > 0 && `${nonTechnicalSkills.length} non-technical`}
                </summary>
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {lessImportantSkills.length > 0 && (
                    <div>
                      <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '8px', fontWeight: 500 }}>
                        Less Important Skills
                      </div>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px'
                      }}>
                        {lessImportantSkills.map((skill, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '5px',
                              background: theme.name === 'dark' 
                                ? 'rgba(156,163,175,0.1)' 
                                : '#f3f4f6',
                              border: `1px solid ${theme.name === 'dark' ? 'rgba(156,163,175,0.2)' : '#e5e7eb'}`,
                              fontSize: '11px',
                              color: theme.colors.textSecondary,
                              whiteSpace: 'nowrap',
                              lineHeight: '1.4'
                            }}
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {nonTechnicalSkills.length > 0 && (
                    <div>
                      <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '8px', fontWeight: 500 }}>
                        Non-Technical Skills
                      </div>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px'
                      }}>
                        {nonTechnicalSkills.map((skill, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '5px',
                              background: theme.name === 'dark' 
                                ? 'rgba(156,163,175,0.05)' 
                                : '#f9fafb',
                              border: `1px solid ${theme.name === 'dark' ? 'rgba(156,163,175,0.1)' : '#e5e7eb'}`,
                              fontSize: '11px',
                              color: theme.colors.textSecondary,
                              whiteSpace: 'nowrap',
                              lineHeight: '1.4'
                            }}
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        )}

        {/* Other Resume Data (Name, Position, Experience) */}
        {Object.entries(resume).filter(([key]) => key !== 'skills' && key !== 'skills_classified').map(([key, value]) => (
          <div key={key} style={{ marginBottom: '20px' }}>
            <div style={{ 
              backgroundImage: theme.name === 'dark' ? 'none' : 'linear-gradient(to right, #f1f5f9, #f8fafc)', 
              backgroundColor: theme.name === 'dark' ? theme.colors.secondaryBackground : undefined, 
              borderRadius: '8px', 
              padding: '12px', 
              marginBottom: '12px' 
            }}>
              <h4 style={{ 
                fontSize: '15px', 
                fontWeight: 600, 
                color: theme.colors.textPrimary, 
                margin: 0, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
            <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '9999px', display: 'inline-block' }} />
            {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </h4>
        </div>
        <div style={{ paddingLeft: '16px' }}>{renderValue(value)}</div>
      </div>
        ))}
      </div>
    );
  }, [theme]);

  return (
    <JobDataWrapper>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Profile & Job Title Section */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.background})`,
          borderRadius: '8px',
          padding: '8px',
          border: `1px solid ${theme.colors.border}`,
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          width: '100%'
        }}>
          {/* User Profile */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: jobData?.title ? '8px' : '0',
            paddingBottom: jobData?.title ? '8px' : '0',
            borderBottom: jobData?.title ? `1px solid ${theme.colors.border}` : 'none'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: theme.colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '600',
              color: theme.colors.white,
              flexShrink: 0
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: theme.colors.textPrimary,
                marginBottom: '4px'
              }}>
                {user?.name || 'User'}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: theme.colors.textSecondary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user?.email || 'No email'}
              </div>
            </div>
          </div>

          {/* Job Title Section */}
          {jobData?.title && (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '4px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.primary,
                  animation: 'pulse 2s infinite'
                }} />
                <span style={{
                  fontSize: '8px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: theme.colors.textSecondary
                }}>
                 JOB ROLE YOU ARE LOOKIN AT
                </span>
              </div>
              <h1 style={{
                fontSize: '11px',
                fontWeight: '600',
                color: theme.colors.textPrimary,
                margin: '0 0 4px 0',
                lineHeight: '1.3'
              }}>
                {jobData.title}
              </h1>
              {jobData.company && (
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.colors.textSecondary,
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Building2 size={14} />
                  {jobData.company}
                </div>
              )}
            </>
          )}
        </div>

        {/* Resume Data Section - Moved to First */}
        <div style={{ background: theme.colors.background, borderRadius: '12px', border: `1px solid ${theme.colors.border}`, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' }}>
          <SectionHeader
            icon={User}
            title="Your Resume Analysis"
            isExpanded={expandedSections.resumeData}
            onToggle={() => toggleSection('resumeData')}
            gradientFrom="#10b981"
            gradientTo="#059669"
          />
          {expandedSections.resumeData && (
            <SectionContent style={{ backgroundImage: theme.name === 'dark' ? 'none' : 'linear-gradient(to bottom right, #f8fafc, #ffffff)', background: theme.colors.background }}>
              {filteredResumeData ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{formatResumeData({ formatted_resume: filteredResumeData })}</div>
              ) : (
                formatResumeData(null)
              )}
            </SectionContent>
          )}
        </div>

        {/* Job Description Section */}
        <div style={{ background: theme.colors.background, borderRadius: '12px', border: `1px solid ${theme.colors.border}`, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' }}>
          <SectionHeader
            icon={Briefcase}
            title="Job Description"
            isExpanded={expandedSections.jobDescription}
            onToggle={() => toggleSection('jobDescription')}
            gradientFrom="#3b82f6"
            gradientTo="#2563eb"
          />
          {expandedSections.jobDescription && (
            <SectionContent>{formatJobDescription(jobData?.description)}</SectionContent>
          )}
        </div>
      </div>
    </JobDataWrapper>
  );
};

export default memo(ResumeViewer);