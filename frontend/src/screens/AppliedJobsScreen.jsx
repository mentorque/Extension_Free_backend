import { useState, useEffect, useRef, useMemo } from 'react';
import { useJobData } from '../context/jobContext';
import { useTheme } from '../context/themeContext.jsx';
import { useAuth } from '../context/authContext.jsx';
import { Briefcase, ExternalLink, Trash2, Calendar, MapPin, Building2, CheckCircle } from 'lucide-react';
import { getTrackedJobs, deleteTrackedJob } from '../utils/trackJobService.js';

const AppliedJobsScreen = () => {
  const { appliedJobs, setAppliedJobs } = useJobData();
  const { theme } = useTheme();
  const { apiKey } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedRef = useRef(false); // Prevent duplicate fetches

  // Fetch applied jobs from API - only when component mounts (lazy loaded, so only when Applied tab is clicked)
  useEffect(() => {
    // Prevent fetching if already fetched or no API key
    if (hasFetchedRef.current || !apiKey) {
      if (!apiKey) {
        setIsLoading(false);
      }
      return;
    }

    let isMounted = true; // Prevent state updates if component unmounts
    
    const fetchAppliedJobs = async () => {
      const startTime = Date.now();
      console.log('[APPLIED_JOBS_SCREEN] Fetching applied jobs from API...');
      
      try {
        const result = await getTrackedJobs(apiKey);
        const duration = Date.now() - startTime;
        
        // Only update state if component is still mounted
        if (!isMounted) {
          console.log('[APPLIED_JOBS_SCREEN] Component unmounted, skipping state update');
          return;
        }
        
        if (result.success) {
          console.log(`[APPLIED_JOBS_SCREEN] Successfully loaded ${result.jobs.length} applied jobs in ${duration}ms`);
          setAppliedJobs(result.jobs);
          hasFetchedRef.current = true;
        } else {
          console.warn('[APPLIED_JOBS_SCREEN] Failed to fetch jobs:', result.error);
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[APPLIED_JOBS_SCREEN] Error fetching applied jobs (${duration}ms):`, {
          message: error.message,
          stack: error.stack,
          apiKey: apiKey ? 'present' : 'missing'
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAppliedJobs();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [apiKey, setAppliedJobs]);

  const handleDelete = async (id, url) => {
    const startTime = Date.now();
    console.log(`[APPLIED_JOBS_SCREEN] Deleting applied job:`, { id, url: url?.substring(0, 100) + (url?.length > 100 ? '...' : '') });
    
    if (!confirm('Remove this job from your list?')) {
      console.log('[APPLIED_JOBS_SCREEN] User cancelled job deletion');
      return;
    }

    try {
      const result = await deleteTrackedJob(id, apiKey);
      const duration = Date.now() - startTime;
      
      if (result.success) {
        console.log(`[APPLIED_JOBS_SCREEN] Successfully deleted job ${id} in ${duration}ms`);
        setAppliedJobs(prev => prev.filter(j => j.id !== id));
      } else {
        console.warn(`[APPLIED_JOBS_SCREEN] Delete request failed:`, result.error);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[APPLIED_JOBS_SCREEN] Error deleting job (${duration}ms):`, {
        message: error.message,
        stack: error.stack,
        id,
        url
      });
    }
  };

  // Optimize filtering with memoization for better Windows laptop performance
  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) {
      return appliedJobs;
    }
    const searchLower = searchTerm.toLowerCase();
    return appliedJobs.filter(job => 
      job.title?.toLowerCase().includes(searchLower) ||
      job.company?.toLowerCase().includes(searchLower)
    );
  }, [appliedJobs, searchTerm]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const containerStyle = {
    minHeight: '100%',
    background: theme.name === 'dark' ? theme.colors.background : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: '16px',
  };

  const contentStyle = {
    maxWidth: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const headerStyle = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '8px'
  };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '700',
    color: theme.colors.textPrimary,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const subtitleStyle = {
    color: theme.colors.textSecondary,
    fontSize: '13px',
    lineHeight: '1.4',
    margin: 0,
  };

  const searchInputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
    color: theme.colors.textPrimary,
    fontSize: '14px',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    outline: 'none'
  };

  const jobCardStyle = {
    background: theme.colors.background,
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${theme.colors.border}`,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const jobTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primary,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    wordBreak: 'break-word',
    lineHeight: '1.4'
  };

  const jobMetaStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '13px',
    color: theme.colors.textSecondary
  };

  const metaItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const deleteButtonStyle = {
    padding: '6px 12px',
    background: 'transparent',
    color: theme.colors.textSecondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    alignSelf: 'flex-start'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '48px 20px',
    color: theme.colors.textSecondary
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: theme.name === 'dark' ? '#0b2a4e' : '#dbeafe',
    color: theme.name === 'dark' ? '#93c5fd' : '#1e40af',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <Briefcase size={24} />
            Applied Jobs
          </h1>
          <p style={subtitleStyle}>
            Track all the jobs you've applied to on LinkedIn
          </p>
          <div style={badgeStyle}>
            <CheckCircle size={14} />
            {appliedJobs.length} {appliedJobs.length === 1 ? 'Application' : 'Applications'}
          </div>
        </div>

        <style>{`
          input[type="text"]::placeholder {
            color: ${theme.colors.textSecondary} !important;
            opacity: 0.7;
          }
        `}</style>
        <input
          type="text"
          placeholder="Search by job title or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = theme.colors.primary;
            e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = theme.colors.border;
            e.target.style.boxShadow = 'none';
          }}
        />

        {isLoading ? (
          <div style={emptyStateStyle}>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary }}>Loading applied jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={emptyStateStyle}>
            <Briefcase size={48} style={{ margin: '0 auto 16px', color: theme.colors.border }} />
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.textPrimary, marginBottom: '8px' }}>
              {searchTerm ? 'No jobs found' : 'No applied jobs yet'}
            </h3>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
              {searchTerm ? 'Try a different search term' : 'Jobs will appear here when you apply on LinkedIn'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredJobs.map((job, index) => (
              <div
                key={`${job.url}-${index}`}
                style={jobCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={jobTitleStyle}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  <span style={{ flex: 1 }}>{job.title}</span>
                  <ExternalLink size={14} style={{ flexShrink: 0 }} />
                </a>

                <div style={jobMetaStyle}>
                  {job.company && (
                    <div style={metaItemStyle}>
                      <Building2 size={14} />
                      <span>{job.company}</span>
                    </div>
                  )}
                  {job.location && (
                    <div style={metaItemStyle}>
                      <MapPin size={14} />
                      <span>{job.location}</span>
                    </div>
                  )}
                  <div style={metaItemStyle}>
                    <Calendar size={14} />
                    <span>Applied: {formatDate(job.appliedDate)}</span>
                  </div>
                </div>

                <button
                  style={deleteButtonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(job.id, job.url);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ef4444';
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.border;
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobsScreen;

