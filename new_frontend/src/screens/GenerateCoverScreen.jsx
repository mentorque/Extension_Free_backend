import { useResume } from '../context/userContext';
import { useJobData } from '../context/jobContext';
import useApi from '../hooks/useApi';
import JobDataWrapper from '../components/JobDataWrapper';
import { GENERATE_COVER_LETTER_URL } from '../constants/index.js';
import { useTheme } from '../context/themeContext.jsx';
// daily usage limit removed

const GenerateCoverScreen = () => {
  const { resumeData } = useResume();
  const { jobData, coverLetterData, setCoverLetterData } = useJobData();
  const { theme } = useTheme();

  const body = {
    jobDescription: jobData?.description || '',
    resume: resumeData?.result?.formatted_resume || {}
  };

  const { isLoading, error, postData } = useApi(GENERATE_COVER_LETTER_URL);

  // Simple company and position extraction
  const company = jobData?.company || 'Company';
  const position = jobData?.title || 'Position';

  const handleSave = async () => {
    const result = await postData(body);
    if (result) {
      console.log('Cover letter result:', result); // Debug log
      console.log('Job data:', jobData); // Debug job data
      setCoverLetterData(result);
    }
  };

  // Modern styling objects
  const containerStyle = {
    minHeight: '100%',
    background: theme.name === 'dark' ? theme.colors.background : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: '24px',
  };

  const contentStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const headerStyle = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: theme.name === 'dark' ? '#0b2a4e' : '#dbeafe',
    color: theme.name === 'dark' ? '#93c5fd' : '#1e40af',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '500',
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: theme.colors.textPrimary,
    margin: 0,
  };

  const subtitleStyle = {
    color: theme.colors.textSecondary,
    fontSize: '16px',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.5',
  };

  const buttonStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 32px',
    fontSize: '18px',
    fontWeight: '600',
    background: isLoading ? '#94a3b8' : theme.colors.primary,
    color: theme.colors.white,
    border: 'none',
    borderRadius: '8px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
    transition: 'all 0.2s ease',
    minWidth: '200px',
  };

  const cardStyle = {
    background: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  };

  const coverLetterCardStyle = {
    ...cardStyle,
    background: theme.name === 'dark' ? 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(14,165,233,0.04) 100%)' : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    border: '1px solid #0ea5e9',
  };

  const errorStyle = {
    background: 'rgba(248,113,113,0.1)',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    padding: '16px',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    maxWidth: '600px',
    margin: '0 auto',
  };

  const copyButtonStyle = {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    background: '#10b981',
    color: theme.colors.white,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    minWidth: '88px',
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

  const formatCoverLetterForDisplay = (coverLetter) => {
    if (!coverLetter) return 'No cover letter generated';

    // If it's already a string (old format), return as is
    if (typeof coverLetter === 'string') {
      return coverLetter;
    }

    // If it's an object (new structured format), format properly WITHOUT headers
    // (headers are already displayed separately in the UI above)
    const parts = [];

    if (coverLetter.greeting) parts.push(coverLetter.greeting);
    if (coverLetter.greeting && coverLetter.body) parts.push(''); // Empty line after greeting

    if (coverLetter.body) parts.push(coverLetter.body);
    if (coverLetter.body && (coverLetter.closing || coverLetter.regards || coverLetter.name)) parts.push(''); // Empty line before closing

    if (coverLetter.closing) parts.push(coverLetter.closing);
    if (coverLetter.regards) parts.push(coverLetter.regards);
    if (coverLetter.name) parts.push(coverLetter.name);

    return parts.join('\n');
  };

  const cleanSubjectLine = (subject, candidateName) => {
    if (!subject || !candidateName) return subject;

    // Remove the candidate's name from the subject line
    const nameParts = candidateName.trim().split(' ');
    let cleanedSubject = subject;

    // Remove each part of the name from the subject
    nameParts.forEach(namePart => {
      if (namePart.length > 1) { // Avoid removing single characters
        cleanedSubject = cleanedSubject.replace(new RegExp(`\\s*-\\s*${namePart}\\s*$`, 'i'), '');
        cleanedSubject = cleanedSubject.replace(new RegExp(`\\s*${namePart}\\s*-\\s*`, 'i'), ' - ');
      }
    });

    return cleanedSubject.trim();
  };

  const buildCopyText = () => {
    const cover = coverLetterData?.result?.cover_letter || {};
    const to = cover.to || `Hiring Manager at ${company}`;
    const from = cover.from || (resumeData?.result?.formatted_resume?.name || 'Applicant');
    const rawSubject = cover.subject || `Application for ${position} - ${company}`;
    const subject = cleanSubjectLine(rawSubject, from);

    const body = formatCoverLetterForDisplay(cover);

    return `To: ${to}\nFrom: ${from}\nSubject: ${subject}\n\n${body}`;
  };

  const handleCopyToClipboard = async () => {
    if (!coverLetterData?.result?.cover_letter) return;
    const textToCopy = buildCopyText();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        throw new Error('Clipboard API not available');
      }
      alert('Cover letter copied to clipboard!');
    } catch (err) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-1000px';
        textarea.style.left = '-1000px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Cover letter copied to clipboard!');
      } catch (fallbackErr) {
        console.error('Failed to copy: ', err || fallbackErr);
        alert('Failed to copy to clipboard');
      }
    }
  };

  return (
    <JobDataWrapper>
      <style>{bounceAnimation}</style>
      
      <div style={containerStyle}>
        <div style={contentStyle}>
          {/* Header Section */}
          <div style={headerStyle}>
            <div style={badgeStyle}>
              ✨ AI-Powered Writing
            </div>
            <h1 style={titleStyle}>Cover Letter Generator</h1>
            <p style={subtitleStyle}>
              Generate a personalized cover letter tailored to the job description using your resume and AI intelligence.
            </p>
          </div>

          {/* Main Action Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={handleSave}
              disabled={isLoading}
              style={buttonStyle}
              onMouseEnter={(e) => { if (!isLoading) e.target.style.backgroundColor = '#1d4ed8'; }}
              onMouseLeave={(e) => { if (!isLoading) e.target.style.backgroundColor = '#2563eb'; }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s ease-in-out infinite',
                      animationDelay: '-0.3s'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s ease-in-out infinite',
                      animationDelay: '-0.15s'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s ease-in-out infinite'
                    }}></div>
                  </div>
                  <span>Generating...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📝 Generate Cover Letter
                </div>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div style={errorStyle}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Cover Letter Display */}
          {coverLetterData && (
            <div style={coverLetterCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: theme.name === 'dark' ? '#7dd3fc' : '#0c4a6e', margin: 0 }}>
                  📄 Your Personalized Cover Letter
                </h3>
                <button
                  onClick={handleCopyToClipboard}
                  style={copyButtonStyle}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                  📋 Copy
                </button>
              </div>
              
              {/* Cover Letter with Headers */}
              <div style={{
                background: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                padding: '24px',
                lineHeight: '1.6',
                fontSize: '14px',
                color: theme.colors.textPrimary,
                whiteSpace: 'pre-wrap'
              }}>
                {/* Header Section */}
                <div style={{ marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#1f2937' }}>To:</strong> {coverLetterData?.result?.cover_letter?.to || `Hiring Manager at ${company}`}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#1f2937' }}>From:</strong> {coverLetterData?.result?.cover_letter?.from || (resumeData?.result?.formatted_resume?.name || 'Applicant')}
                  </div>
                  <div>
                    <strong style={{ color: '#1f2937' }}>Subject:</strong> {cleanSubjectLine(coverLetterData?.result?.cover_letter?.subject, coverLetterData?.result?.cover_letter?.from) || `Application for ${position} - ${company}`}
                  </div>
                </div>

                {/* Cover Letter Content */}
                <div>
                  {coverLetterData.result?.cover_letter ?
                    formatCoverLetterForDisplay(coverLetterData.result.cover_letter) :
                    'Cover letter content will appear here...'}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </JobDataWrapper>
  );
};

export default GenerateCoverScreen;