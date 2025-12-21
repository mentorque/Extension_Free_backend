// frontend/src/screens/displayUserData.jsx
import { useJobData } from "../context/jobContext";
import { useResume } from "../context/userContext";
import { useEffect, useState, useCallback, memo } from "react";
import { Briefcase, User, FileText, Star, ChevronDown, ChevronUp, CheckCircle, Circle, Upload } from "lucide-react";
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
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState({
    jobDescription: true,
    resumeData: false
  });

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

    return Object.entries(data.formatted_resume || data).map(([key, value]) => (
      <div key={key} style={{ marginBottom: '24px' }}>
        <div style={{ backgroundImage: 'linear-gradient(to right, #f1f5f9, #f8fafc)', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '9999px', display: 'inline-block' }} />
            {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </h4>
        </div>
        <div style={{ paddingLeft: '16px' }}>{renderValue(value)}</div>
      </div>
    ));
  }, []);

  return (
    <JobDataWrapper>
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

        {/* Resume Data Section */}
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
              {resumeData && resumeData.result && resumeData.result.formatted_resume ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{formatResumeData(resumeData.result)}</div>
              ) : (
                formatResumeData(null)
              )}
            </SectionContent>
          )}
        </div>
      </div>
    </JobDataWrapper>
  );
};

export default memo(ResumeViewer);