import { useState, useEffect, useMemo } from 'react';
import useApi from '../hooks/useApi';
import { apiClient } from '../utils/apiClient.js';
import { HR_LOOKUP_URL } from '../constants/index.js';
import { useTheme } from '../context/themeContext.jsx';
import { useAuth } from '../context/authContext.jsx';
import PremiumLoadingAnimation from '../components/PremiumLoadingAnimation';

const HRLookupScreen = () => {
  const [companiesInput, setCompaniesInput] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const { isLoading, error, postData } = useApi(HR_LOOKUP_URL);
  const { theme } = useTheme();
  const { apiKey } = useAuth();

  const loadingMessages = [
    'Searching for companies...',
    'Finding HR profiles...',
    'Scanning LinkedIn data...',
    'Compiling results...',
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

  // Parse companies from input - useMemo to recompute when companiesInput changes
  const companies = useMemo(() => {
    return companiesInput
    .split('\n')
    .map((c) => c.trim())
    .filter(Boolean);
  }, [companiesInput]);

  const handleLookup = async () => {
    try {
    const body = { companies, location };
      console.log('[HR Lookup Screen] Starting lookup for', companies.length, 'companies');
      
    const response = await postData(body);
      console.log('[HR Lookup Screen] Response received:', response);
      
      // Backend now always returns JSON:
      // - For >5 companies: { format: 'csv', text: 'csv content', results: [...] }
      // - For ≤5 companies: [array of results]
    if (response && Array.isArray(response)) {
        // JSON array response (≤5 companies)
        console.log('[HR Lookup Screen] Setting results (JSON array):', response.length, 'items');
      setResults(response);
      } else if (response && response.format === 'csv' && response.results) {
        // CSV wrapped in JSON (>5 companies) - use results array for display
        console.log('[HR Lookup Screen] Setting results from CSV response:', response.results.length, 'items');
        setResults(response.results);
      } else if (response && response.format === 'csv' && response.results) {
        // CSV wrapped in JSON (>5 companies) - use results array for display
        console.log('[HR Lookup Screen] Setting results from CSV response:', response.results.length, 'items');
        setResults(response.results);
      } else if (response && response.text) {
        // Legacy: Handle CSV response (fallback for old format)
        console.log('[HR Lookup Screen] Received CSV response (legacy), converting to array for display');
        console.log('[HR Lookup Screen] CSV text length:', response.text.length);
        console.log('[HR Lookup Screen] CSV preview:', response.text.substring(0, 200));
        
        // Parse CSV to array for display
        const csvText = response.text;
        const lines = csvText.split('\n').filter(line => line.trim());
        
        if (lines.length > 1) {
          // Parse headers (handle quoted values)
          const parseCSVLine = (line) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                  current += '"';
                  i++; // Skip next quote
                } else {
                  inQuotes = !inQuotes;
                }
              } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            result.push(current.trim());
            return result;
          };
          
          const headers = parseCSVLine(lines[0]);
          console.log('[HR Lookup Screen] Headers:', headers);
          
          const data = lines.slice(1).map((line, idx) => {
            const values = parseCSVLine(line);
            const obj = {};
            headers.forEach((header, i) => {
              obj[header] = values[i] || '';
            });
            return obj;
          }).filter(row => row['Company Name']); // Filter out empty rows
          
          console.log('[HR Lookup Screen] Parsed CSV to array:', data.length, 'items');
          console.log('[HR Lookup Screen] First item:', data[0]);
          setResults(data);
        } else {
          console.warn('[HR Lookup Screen] CSV response but no data lines');
          setResults(null);
        }
    } else {
        console.warn('[HR Lookup Screen] Unexpected response format:', response);
        setResults(null);
      }
    } catch (error) {
      console.error('[HR Lookup Screen] Error in handleLookup:', error);
      setResults(null);
    }
  };

  // Helper function to convert results array to CSV
  const convertResultsToCsv = (resultsArray) => {
    if (!resultsArray || !Array.isArray(resultsArray) || resultsArray.length === 0) {
      throw new Error('No results to download');
    }
    
    const headers = ['Company Name', 'Website', 'Company LinkedIn URL', 'HR LinkedIn URL', 'HR LinkedIn URLs', 'HR First Name', 'HR Last Name'];
    const escape = (value) => {
      if (value == null) return '';
      const str = String(value);
      if (/[",\n]/.test(str)) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };
    
    const lines = [headers.join(',')];
    for (const row of resultsArray) {
      lines.push([
        escape(row['Company Name']),
        escape(row['Website']),
        escape(row['Company LinkedIn URL']),
        escape(row['HR LinkedIn URL']),
        escape(Array.isArray(row['HR LinkedIn URLs']) ? row['HR LinkedIn URLs'].join('; ') : ''),
        escape(row['HR First Name']),
        escape(row['HR Last Name']),
      ].join(','));
    }
    
    return lines.join('\n');
  };

  const handleDownloadCsv = async () => {
    try {
      // Use existing results instead of making a new API call
      if (!results || !Array.isArray(results) || results.length === 0) {
        setNotice('Please run lookup first to get results');
        setTimeout(() => setNotice(''), 3000);
        return;
      }
      
      console.log('[HR Lookup Screen] Downloading CSV from existing results:', results.length, 'items');

      setIsDownloading(true);
      setProgress(0);
      setNotice('Preparing download…');

      // Small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setProgress(50);
      setNotice('Converting to CSV…');

      // Convert results to CSV
      const csvText = convertResultsToCsv(results);
      
      if (!csvText || csvText.length === 0) {
        throw new Error('CSV content is empty');
      }
      
      console.log('[HR Lookup Screen] CSV generated, length:', csvText.length);
      setProgress(90);
      setNotice('Starting download…');

      console.log('[HR Lookup Screen] Creating download...');
      console.log('[HR Lookup Screen] CSV text length:', csvText.length);
      
      // Send CSV to background script for download (required for Chrome extensions)
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        console.log('[HR Lookup Screen] Sending CSV to background script for download...');
        
        chrome.runtime.sendMessage({
          type: 'DOWNLOAD_CSV',
          csvText: csvText,
          filename: 'hr_results.csv'
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('[HR Lookup Screen] Background script error:', chrome.runtime.lastError);
            setNotice(`Download failed: ${chrome.runtime.lastError.message}`);
            setIsDownloading(false);
            setProgress(0);
            return;
          }
          
          if (response && response.success) {
            console.log('[HR Lookup Screen] ✅ Download started via background script');
          } else {
            console.error('[HR Lookup Screen] Download failed:', response?.error);
            setNotice(`Download failed: ${response?.error?.message || 'Unknown error'}`);
            setIsDownloading(false);
            setProgress(0);
          }
        });
      } else {
        // Fallback: Try direct download (may not work in extension context)
        console.warn('[HR Lookup Screen] Chrome runtime not available, trying fallback...');
        try {
          const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvText);
      const a = document.createElement('a');
          a.href = dataUrl;
      a.download = 'hr_results.csv';
          a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
          
          setTimeout(() => {
            if (document.body.contains(a)) {
              document.body.removeChild(a);
            }
          }, 100);
          
          console.log('[HR Lookup Screen] ✅ Fallback download triggered');
        } catch (fallbackError) {
          console.error('[HR Lookup Screen] ❌ All download methods failed:', fallbackError);
          throw new Error(`Download failed: ${fallbackError.message}`);
        }
      }

      // Finish progress and show complete
      setProgress(100);
      setNotice('Download complete');
      setTimeout(() => {
        setIsDownloading(false);
        setNotice('');
        setProgress(0);
      }, 1500);
    } catch (error) {
      console.error('[HR Lookup Screen] CSV download error:', error);
      console.error('[HR Lookup Screen] Error details:', {
        message: error.message,
        stack: error.stack
      });
      setNotice(`Download failed: ${error.message}`);
      setProgress(0);
      setTimeout(() => {
        setNotice('');
      setIsDownloading(false);
      }, 3000);
    }
  };

  const container = {
    minHeight: '100%',
    background: theme.name === 'dark' ? theme.colors.background : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: '16px',
  };

  const content = {
    maxWidth: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const header = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const title = {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.colors.textPrimary,
    margin: 0,
  };

  const subtitle = {
    color: theme.colors.textSecondary,
    fontSize: '12px',
    lineHeight: '1.4',
    margin: 0,
  };

  const input = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
    color: theme.colors.textPrimary,
    fontSize: '14px',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  };

  const button = {
    padding: '12px 20px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    color: theme.colors.white,
    background: theme.colors.primary,
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: 'inherit',
  };

  const card = {
    background: theme.colors.background,
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    border: `1px solid ${theme.colors.border}`,
    transition: 'all 0.2s ease',
  };

  const cardHeader = {
    background: theme.name === 'dark' ? '#0f172a' : '#1e293b',
    color: theme.colors.white,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const companyTitle = {
    fontSize: '16px',
    fontWeight: '700',
    margin: 0,
    color: theme.colors.white,
  };

  const cardBody = {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const label = {
    color: theme.colors.textSecondary,
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '8px',
  };

  const value = {
    color: theme.colors.textPrimary,
    fontWeight: 600,
    wordBreak: 'break-word',
  };

  const hrLinkRow = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 0',
    borderBottom: `1px solid ${theme.colors.border}20`,
  };

  const numberBadge = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.colors.secondaryBackground,
    color: theme.colors.textSecondary,
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
    border: `1px solid ${theme.colors.border}`,
  };

  const progressWrap = {
    marginTop: '8px',
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.secondaryBackground,
    borderRadius: '10px',
    overflow: 'hidden',
    height: '12px',
  };

  const progressBar = {
    width: `${progress}%`,
    height: '100%',
    background: `linear-gradient(90deg, ${theme.colors.primary} 0%, #3b82f6 100%)`,
    transition: 'width 100ms linear',
  };

  return (
    <div style={container}>
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
      
      <div style={content}>
        <div style={header}>
          <h1 style={title}>HR Lookup</h1>
          <p style={subtitle}>Enter company names to quickly find up to three relevant HR LinkedIn profiles for each company.</p>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: theme.colors.textSecondary, fontSize: '14px', fontWeight: '500' }}>
            Companies (one per line)
          </label>
          <textarea
            style={{ 
              ...input, 
              minHeight: '100px', 
              resize: 'vertical',
              lineHeight: '1.5'
            }}
            value={companiesInput}
            onChange={(e) => setCompaniesInput(e.target.value)}
            placeholder={'Acme Corp\nGlobex\nUmbrella Corporation\nStark Industries\nWayne Enterprises'}
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

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: theme.colors.textSecondary, fontSize: '14px', fontWeight: '500' }}>
            Location (optional)
          </label>
          <input
            style={input}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={'San Francisco, CA'}
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

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            style={{
              ...button,
              background: isLoading || companies.length === 0 ? '#9ca3af' : theme.colors.primary,
              cursor: isLoading || companies.length === 0 ? 'not-allowed' : 'pointer',
              transform: isLoading || companies.length === 0 ? 'none' : 'scale(1)',
            }}
            disabled={isLoading || companies.length === 0}
            onClick={handleLookup}
            onMouseEnter={(e) => { 
              if (!isLoading && companies.length > 0) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.3)';
              }
            }}
            onMouseLeave={(e) => { 
              if (!isLoading && companies.length > 0) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            Lookup
          </button>
          {companies.length > 5 && (
            <button
              disabled={isDownloading}
              style={{
                ...button,
                background: isDownloading ? '#9ca3af' : theme.colors.textPrimary,
                opacity: isDownloading ? 0.7 : 1,
                cursor: isDownloading ? 'not-allowed' : 'pointer',
                transform: isDownloading ? 'scale(0.98)' : 'scale(1)',
              }}
              onClick={handleDownloadCsv}
              onMouseEnter={(e) => { 
                if (!isDownloading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => { 
                if (!isDownloading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {isDownloading ? 'Downloading…' : 'Download CSV'}
            </button>
          )}
        </div>

        {(isDownloading || notice) && (
          <div style={{ marginTop: '12px' }}>
            <div style={{ color: theme.colors.textSecondary, marginBottom: '8px', fontSize: '14px' }}>
              {notice}
            </div>
            {isDownloading && (
              <div style={progressWrap}>
                <div style={progressBar}></div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ 
            color: '#ef4444', 
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {results && results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {results.map((row, idx) => {
              const hrLinks = Array.isArray(row['HR LinkedIn URLs'])
                ? row['HR LinkedIn URLs']
                : (row['HR LinkedIn URL'] ? [row['HR LinkedIn URL']] : []);
              return (
                <div 
                  key={idx} 
                  style={card}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={cardHeader}>
                    <span style={{ fontSize: '18px' }}>🧑‍💼</span>
                    <h3 style={companyTitle}>{row['Company Name'] || 'Unknown Company'}</h3>
                  </div>
                  <div style={cardBody}>
                    <div>
                      <div style={label}>HR LinkedIn Profiles</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {hrLinks.length > 0 ? hrLinks.map((url, i) => (
                          <div key={i} style={hrLinkRow}>
                            <span style={numberBadge}>{i + 1}</span>
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{
                                color: theme.colors.primary,
                                textDecoration: 'none',
                                fontSize: '14px',
                                flex: 1,
                                wordBreak: 'break-all'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.textDecoration = 'underline';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.textDecoration = 'none';
                              }}
                            >
                              {url}
                            </a>
                          </div>
                        )) : (
                          <span style={{ color: theme.colors.textSecondary, fontSize: '14px', fontStyle: 'italic' }}>
                            No HR profiles found
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRLookupScreen;