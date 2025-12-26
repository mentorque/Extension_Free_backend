import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import config from '../config';
import { apiClient } from '../utils/apiClient';
import { XCircle, Clock, AlertCircle } from 'lucide-react';

const LoginScreen = ({ onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorCode(null);
    
    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }

    setIsLoading(true);
    
    try {
      // Validate API key with backend using apiClient
      const trimmedApiKey = apiKey.trim();
      const apiUrl = `${config.apiBaseUrl}/auth/validate`;
      console.log('[LOGIN] Attempting to validate API key:', { 
        apiUrl, 
        hasApiKey: !!trimmedApiKey,
        apiKeyLength: trimmedApiKey.length,
        apiKeyPrefix: trimmedApiKey.substring(0, 8) + '...'
      });
      
      const response = await apiClient.post(apiUrl, {}, {
        headers: {
          'x-api-key': trimmedApiKey
        }
      });
      
      console.log('[LOGIN] API response:', { 
        status: response.status, 
        ok: response.ok
      });

      // Parse response data
      let responseData;
      try {
        responseData = await response.json();
        console.log('[LOGIN] Response data:', responseData);
      } catch (jsonError) {
        console.error('[LOGIN] Failed to parse response JSON:', jsonError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        const errorMessage = responseData?.message || 'Invalid API key';
        const errorCodeValue = responseData?.errorCode || null;
        
        console.log('[LOGIN] Error response:', { 
          status: response.status, 
          message: errorMessage, 
          errorCode: errorCodeValue 
        });
        
        // If user is deleted or not verified, show only the error message
        if (errorCodeValue === 'USER_DELETED' || errorCodeValue === 'USER_NOT_VERIFIED') {
          setError(errorMessage);
          setErrorCode(errorCodeValue);
          setIsLoading(false);
          return;
        }
        
        throw new Error(errorMessage);
      }

      // Check if response indicates success
      if (responseData && responseData.success === false) {
        const errorMessage = responseData?.message || 'Invalid API key';
        const errorCodeValue = responseData?.errorCode || null;
        
        console.log('[LOGIN] Success false in response data:', { 
          message: errorMessage, 
          errorCode: errorCodeValue 
        });
        
        // If user is deleted or not verified, show only the error message
        if (errorCodeValue === 'USER_DELETED' || errorCodeValue === 'USER_NOT_VERIFIED') {
          setError(errorMessage);
          setErrorCode(errorCodeValue);
          setIsLoading(false);
          return;
        }
        
        throw new Error(errorMessage);
      }

      // Validate that we have user data
      if (!responseData || !responseData.user) {
        console.error('[LOGIN] Missing user data in response:', responseData);
        throw new Error('Invalid response: missing user data');
      }

      console.log('[LOGIN] Login successful, storing credentials');
      
      // Store API key and user data
      await login(trimmedApiKey, responseData.user);
    } catch (err) {
      console.error('[LOGIN] Authentication error:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
        isNetworkError: err.message?.includes('Failed to fetch'),
        isCorsError: err.message?.includes('CORS')
      });
      
      if (err.message?.includes('Failed to fetch')) {
        setError('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Failed to authenticate. Please check your API key.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If user is deleted or not verified, show only the error message
  const showOnlyError = errorCode === 'USER_DELETED' || errorCode === 'USER_NOT_VERIFIED';

  return (
    <>
      {/* Backdrop */}
      <div style={styles.backdrop} onClick={onClose} />

      {/* Modal Card */}
      <div style={styles.card}>
        {!showOnlyError && (
          <button
            aria-label="Close"
            onClick={onClose}
            style={styles.closeButton}
          >
            ×
          </button>
        )}
        
        {!showOnlyError && (
          <div style={styles.header}>
            <div style={styles.logoContainer}>
              <img
                src={chrome.runtime.getURL("mentorquedu_logo.png")}
                alt="Mentorque"
                style={{
                  width: '64px',
                  height: '64px',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
            </div>
            <h1 style={styles.title}>Mentorque AI Job Assistant - Trial</h1>
            <p style={styles.subtitle}>Enter your API key to continue</p>
          </div>
        )}

        {showOnlyError ? (
          <div style={styles.errorOnlyContainer}>
            <div style={errorCode === 'USER_DELETED' ? styles.errorDeletedCard : styles.errorNotVerifiedCard}>
              <div style={styles.errorIconContainer}>
                {errorCode === 'USER_DELETED' ? (
                  <XCircle size={48} style={styles.errorIconDeleted} />
                ) : (
                  <Clock size={48} style={styles.errorIconNotVerified} />
                )}
              </div>
              <h2 style={errorCode === 'USER_DELETED' ? styles.errorTitleDeleted : styles.errorTitleNotVerified}>
                {errorCode === 'USER_DELETED' ? 'Account Deleted' : 'Account Pending Verification'}
              </h2>
              <p style={errorCode === 'USER_DELETED' ? styles.errorMessageDeleted : styles.errorMessageNotVerified}>
                {error}
              </p>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  style={styles.input}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div style={styles.error}>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                style={{
                  ...styles.button,
                  ...(isLoading ? styles.buttonDisabled : {})
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Continue'}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Don't have an API key?{' '}
                <a 
                  href={`${config.websiteUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  Get one here
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 10000
  },
  card: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    width: '100%',
    maxWidth: '400px',
    zIndex: 10001
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 6,
    border: '1px solid #eee',
    background: '#fff',
    cursor: 'pointer',
    color: '#666',
    fontSize: 18,
    lineHeight: '24px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16px'
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  logoInner: {
    width: '20px',
    height: '20px',
    backgroundColor: '#1e293b',
    borderRadius: '4px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit'
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid #fcc'
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '8px'
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center'
  },
  footerText: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '500'
  },
  errorOnlyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    padding: '40px 32px'
  },
  errorDeletedCard: {
    width: '100%',
    maxWidth: '360px',
    padding: '32px',
    backgroundColor: '#fff5f5',
    borderRadius: '16px',
    border: '2px solid #fecaca',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  errorNotVerifiedCard: {
    width: '100%',
    maxWidth: '360px',
    padding: '32px',
    backgroundColor: '#fffbeb',
    borderRadius: '16px',
    border: '2px solid #fde68a',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  errorIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  errorIconDeleted: {
    color: '#dc2626',
    strokeWidth: 1.5
  },
  errorIconNotVerified: {
    color: '#d97706',
    strokeWidth: 1.5
  },
  errorTitleDeleted: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#991b1b',
    margin: '0 0 12px 0',
    lineHeight: '1.3'
  },
  errorTitleNotVerified: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#92400e',
    margin: '0 0 12px 0',
    lineHeight: '1.3'
  },
  errorMessageDeleted: {
    fontSize: '15px',
    color: '#7f1d1d',
    lineHeight: '1.6',
    margin: 0,
    padding: 0
  },
  errorMessageNotVerified: {
    fontSize: '15px',
    color: '#78350f',
    lineHeight: '1.6',
    margin: 0,
    padding: 0
  }
};

export default LoginScreen;