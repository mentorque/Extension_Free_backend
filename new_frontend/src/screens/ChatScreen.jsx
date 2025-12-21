import { useState } from 'react';
import { useResume } from '../context/userContext';
import { useJobData } from '../context/jobContext';
import { useTheme } from '../context/themeContext.jsx';
import useApi from '../hooks/useApi';
import { CHAT_URL } from '../constants/index.js';
import JobDataWrapper from '../components/JobDataWrapper';
// daily usage limit removed

const ChatScreen = () => {
  const { resumeData } = useResume();
  const { jobData } = useJobData();
  const { theme } = useTheme();
  const { isLoading, error, postData } = useApi(CHAT_URL);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAsk = async () => {
    if (!question.trim()) return;
    const body = {
      jobDescription: jobData?.description || '',
      resume: resumeData?.result?.formatted_resume || {},
      question: question.trim()
    };
    const result = await postData(body);
    if (result?.result) setAnswer(result.result);
  };

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
    fontSize: '28px',
    fontWeight: '700',
    color: theme.colors.textPrimary,
    margin: 0,
  };

  const subtitleStyle = {
    color: theme.colors.textSecondary,
    fontSize: '14px',
    maxWidth: '620px',
    margin: '0 auto',
    lineHeight: '1.6',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
    color: theme.colors.textPrimary,
    outline: 'none',
    resize: 'vertical'
  };

  const buttonStyle = {
    alignSelf: 'flex-start',
    padding: '10px 16px',
    background: isLoading ? '#94a3b8' : theme.colors.primary,
    color: theme.colors.white,
    border: 'none',
    borderRadius: '8px',
    cursor: isLoading ? 'not-allowed' : 'pointer'
  };

  const cardStyle = {
    background: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    maxHeight: 'none',
    overflow: 'visible'
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: `1px solid ${theme.colors.border}`,
  };

  const cardTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: theme.colors.textPrimary
  };

  return (
    <JobDataWrapper>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div style={headerStyle}>
            <div style={badgeStyle}>🗣️ Job Q&A</div>
            <h1 style={titleStyle}>Ask about your fit or experience</h1>
            <p style={subtitleStyle}>Get concise, first-person answers grounded in your resume and this job description.</p>
          </div>

          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>Your Question</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <textarea
                rows={4}
                placeholder="Why are you a good fit? Tell me about a time…"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={inputStyle}
              />
              <button
                onClick={handleAsk}
                disabled={isLoading}
                style={buttonStyle}
                onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = theme.colors.primaryHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isLoading ? '#94a3b8' : theme.colors.primary; }}
              >
                {isLoading ? 'Thinking…' : 'Generate Answer'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ ...cardStyle, borderColor: '#fecaca', color: '#b91c1c' }}>
              {error}
            </div>
          )}

          {answer && (
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: theme.colors.textSecondary, letterSpacing: '0.02em' }}>
                  Answer
                </div>
              </div>
              <div style={{
                whiteSpace: 'pre-wrap',
                color: theme.colors.textPrimary,
                lineHeight: '1.7',
                fontSize: '14px',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                maxHeight: '40vh',
                overflowY: 'auto'
              }}>{answer}</div>
            </div>
          )}
        </div>
      </div>
    </JobDataWrapper>
  );
};

export default ChatScreen;


