import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

const countWords = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.substring(0, length)}…`;
};

// Compact version - just role and company in a single row
const JobSummaryCompact = ({ jobData, theme }) => {
  if (!jobData) return null;

  const wrapperStyle = {
    width: '100%',
    borderRadius: 8,
    padding: '8px 10px',
    background: theme.name === 'dark'
      ? 'rgba(59,130,246,0.08)'
      : '#f0f9ff',
    border: theme.name === 'dark'
      ? '1px solid rgba(59,130,246,0.2)'
      : '1px solid #bae6fd',
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  };

  const labelStyle = {
    fontSize: '7px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: theme.colors.textSecondary,
  };

  const valueStyle = {
    fontSize: '11px',
    color: theme.colors.textPrimary,
    fontWeight: 500,
  };

  return (
    <div style={wrapperStyle}>
      <span style={labelStyle}>🎯</span>
      <span style={valueStyle}>{jobData.title || 'No role'}</span>
      {jobData.company && (
        <>
          <span style={{ color: theme.colors.textSecondary, fontSize: '10px' }}>at</span>
          <span style={{ ...valueStyle, fontWeight: 400 }}>{jobData.company}</span>
        </>
      )}
      {jobData.description && (
        <CheckCircle2 size={10} style={{ color: '#22c55e', marginLeft: 'auto' }} />
      )}
    </div>
  );
};

// Full version with all details
const JobSummaryCard = ({ jobData, theme, compact = false }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (!jobData) return null;

  // Use compact version if requested
  if (compact) {
    return <JobSummaryCompact jobData={jobData} theme={theme} />;
  }

  const roleMissing = !jobData.title;
  const companyMissing = !jobData.company;
  const descriptionMissing = !jobData.description;
  const descriptionWordCount = countWords(jobData.description || '');
  const descriptionTooShort = descriptionWordCount > 0 && descriptionWordCount < 5;

  const getDescriptionValue = () => {
    if (descriptionMissing) {
      return 'Description not detected yet';
    }
    if (descriptionTooShort) {
      return null;
    }
    const fullText = jobData.description || '';
    if (isDescriptionExpanded) {
      return fullText;
    }
    return truncateText(fullText, 120);
  };

  const descriptionValue = getDescriptionValue();
  const shouldShowCollapseButton = jobData.description && 
    !descriptionTooShort && 
    jobData.description.length > 120;

  const wrapperStyle = {
    width: '100%',
    borderRadius: 10,
    padding: '10px',
    background: theme.name === 'dark'
      ? 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(56,189,248,0.05) 60%)'
      : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    border: theme.name === 'dark'
      ? '1px solid rgba(59,130,246,0.2)'
      : '1px solid #bae6fd',
    boxShadow: theme.name === 'dark'
      ? '0 4px 12px rgba(15,23,42,0.2)'
      : '0 4px 12px rgba(148,187,233,0.15)',
    marginBottom: 12,
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  };

  const badgeStyle = {
    fontSize: '7px',
    fontWeight: 400,
    letterSpacing: '0.08em',
    color: theme.name === 'dark' ? '#bfdbfe' : '#1d4ed8',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const itemContainerStyle = {
    background: theme.name === 'dark'
      ? 'rgba(255,255,255,0.02)'
      : 'rgba(15,23,42,0.02)',
    borderRadius: '6px',
    padding: '6px 8px',
    border: `1px solid ${theme.colors.border}`,
  };

  const labelStyle = {
    fontSize: '6px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: theme.colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    marginBottom: '2px',
  };

  const valueStyle = (isMissing) => ({
    fontSize: isMissing ? '9px' : '11px',
    fontWeight: 400,
    color: isMissing ? theme.colors.textSecondary : theme.colors.textPrimary,
    lineHeight: 1.3,
  });

  const iconStyle = (isMissing) => ({
    color: isMissing ? '#f87171' : '#22c55e',
    width: 8,
    height: 8,
  });

  const refreshMessageStyle = {
    background: theme.name === 'dark' 
      ? 'rgba(251,191,36,0.12)' 
      : '#fef3c7',
    border: `1px solid ${theme.name === 'dark' ? 'rgba(251,191,36,0.25)' : '#fbbf24'}`,
    borderRadius: '6px',
    padding: '6px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '9px',
    color: theme.name === 'dark' ? '#fbbf24' : '#92400e',
    marginTop: '6px',
  };

  return (
    <div style={wrapperStyle}>
      <div style={headerStyle}>
        <div style={badgeStyle}>
          🎯 Job Summary
        </div>
        <div style={{ fontSize: '8px', color: theme.colors.textSecondary }}>
          Auto-scraped
        </div>
      </div>

      {/* Role & Company - Side by side */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
        <div style={{ ...itemContainerStyle, flex: 1, minWidth: 0 }}>
          <div style={labelStyle}>
            {roleMissing ? (
              <AlertCircle style={iconStyle(true)} />
            ) : (
              <CheckCircle2 style={iconStyle(false)} />
            )}
            Role
          </div>
          <div style={{...valueStyle(roleMissing), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
            {jobData.title || 'Not detected'}
          </div>
        </div>

        <div style={{ ...itemContainerStyle, flex: 1, minWidth: 0 }}>
          <div style={labelStyle}>
            {companyMissing ? (
              <AlertCircle style={iconStyle(true)} />
            ) : (
              <CheckCircle2 style={iconStyle(false)} />
            )}
            Company
          </div>
          <div style={{...valueStyle(companyMissing), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
            {jobData.company || 'Not detected'}
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={itemContainerStyle}>
        <div style={labelStyle}>
          {descriptionTooShort ? (
            <AlertCircle style={{ ...iconStyle(true), color: '#fbbf24' }} />
          ) : descriptionMissing ? (
            <AlertCircle style={iconStyle(true)} />
          ) : (
            <CheckCircle2 style={iconStyle(false)} />
          )}
          Description
        </div>
        {descriptionTooShort ? (
          <div style={refreshMessageStyle}>
            <RefreshCw size={10} />
            <span>Not scraped properly. Please refresh the tab.</span>
          </div>
        ) : (
          <>
            <div style={{...valueStyle(descriptionMissing), whiteSpace: 'pre-line'}}>
              {descriptionValue}
            </div>
            {shouldShowCollapseButton && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                style={{
                  marginTop: '4px',
                  background: 'transparent',
                  border: 'none',
                  color: theme.colors.textSecondary,
                  fontSize: '8px',
                  fontWeight: 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '2px 0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }}
              >
                {isDescriptionExpanded ? (
                  <>
                    <ChevronUp size={10} />
                    Less
                  </>
                ) : (
                  <>
                    <ChevronDown size={10} />
                    More
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobSummaryCard;
