// frontend/src/components/ResumeModal.jsx
import React, { useState } from 'react';
import useApi from '../hooks/useApi.jsx';
import { useResume } from '../context/userContext';
import {UPLOAD_RESUME_URL} from '../constants/index.js';
import { useTheme } from '../context/themeContext.jsx';

const ResumeModal = ({ onClose }) => {
  const [text, setText] = useState("");
  const { setResumeData } = useResume();
  const { isLoading, error, postData } = useApi(UPLOAD_RESUME_URL);
  const { theme } = useTheme();

  const handleSave = async () => {
    try {
      console.log('[ResumeModal] Submitting resumeText length:', (text || '').length);
      const result = await postData({ resumeText: text });
      console.log('[ResumeModal] Received result keys:', Object.keys(result || {}));
      console.log('[ResumeModal] Received result:', result);
      
      if (result) {
        // Save to context (which automatically saves to localStorage)
        setResumeData(result);
        console.log('[ResumeModal] ✅ Resume data saved to context and localStorage');
        
        // Verify it was saved
        if (typeof window !== 'undefined' && window.localStorage) {
          const saved = localStorage.getItem('resumeData');
          if (saved) {
            console.log('[ResumeModal] ✅ Verified: Resume data is in localStorage');
          } else {
            console.warn('[ResumeModal] ⚠️  Resume data not found in localStorage after save');
          }
        }
      }
      onClose();
    } catch (e) {
      // Keep modal open on error
      console.error('[ResumeModal] Submission error:', e);
    }
  };

  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    zIndex: 10002,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto',
    animation: 'fadeIn 0.2s ease-out'
  };

  const modalStyle = {
    background: theme.colors.background,
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    width: '90vw',
    maxWidth: '640px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'slideIn 0.3s ease-out'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px'
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '200px',
    padding: '16px',
    fontSize: '14px',
    lineHeight: '1.5',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    resize: 'vertical',
    fontFamily: 'monospace',
    backgroundColor: theme.colors.secondaryBackground,
    color: theme.colors.textPrimary,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '100px',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: theme.colors.secondaryBackground,
    color: theme.colors.textSecondary,
  };

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: isLoading ? '#94a3b8' : theme.colors.primary,
    color: theme.colors.white,
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? 0.8 : 1
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '8px',
    flexWrap: 'wrap',
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(-20px) scale(0.98); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .resume-textarea::placeholder {
          color: ${theme.colors.textSecondary};
          opacity: 0.6;
        }
      `}</style>

      <div style={backdropStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()} className="modal-content">
          <div style={headerStyle}>
            <div style={{ fontSize: '24px' }}>📄</div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: theme.colors.textPrimary }}>
              Upload Your Resume
            </h2>
          </div>
          
          <p style={{ 
            margin: 0, 
            color: theme.colors.textSecondary, 
            fontSize: '14px', 
            lineHeight: '1.5' 
          }}>
            Paste your resume to get started. We'll help you tailor it to the job description.
          </p>

          <div style={{ position: 'relative' }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your resume here..."
              style={textareaStyle}
              className="resume-textarea"
              onFocus={(e) => {
                e.target.style.borderColor = theme.colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <div style={{
              background: theme.colors.dangerBackground,
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '12px 16px',
              color: theme.colors.danger,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span>
              <span>Error: {error}</span>
            </div>
          )}

          <div style={buttonContainerStyle} className="button-container">
            <button 
              onClick={onClose} 
              style={cancelButtonStyle}
              disabled={isLoading}
              onMouseEnter={(e) => { if (!isLoading) e.target.style.backgroundColor = theme.colors.background; }}
              onMouseLeave={(e) => { if (!isLoading) e.target.style.backgroundColor = theme.colors.secondaryBackground; }}
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              style={saveButtonStyle}
              disabled={isLoading || !text.trim()}
              onMouseEnter={(e) => { if (!isLoading && text.trim()) e.target.style.backgroundColor = theme.colors.primaryHover; }}
              onMouseLeave={(e) => { if (!isLoading && text.trim()) e.target.style.backgroundColor = theme.colors.primary; }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Analyzing...
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚀</span>
                  Save & Analyze
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeModal;