import { useState } from 'react';
import useApi from '../hooks/useApi';
import { HR_LOOKUP_URL } from '../constants/index.js';
import { useTheme } from '../context/themeContext.jsx';

const HRLookupScreen = () => {
  const [companiesInput, setCompaniesInput] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState('');
  const { isLoading, error, postData } = useApi(HR_LOOKUP_URL);
  const { theme } = useTheme();

  const companies = companiesInput
    .split('\n')
    .map((c) => c.trim())
    .filter(Boolean);

  const handleLookup = async () => {
    const body = { companies, location };
    const response = await postData(body);
    // If response is JSON for <= 5 companies
    if (response && Array.isArray(response)) {
      setResults(response);
    } else {
      setResults(null);
    }
  };

  const handleDownloadCsv = async () => {
    try {
      // Simulated progress: ~2s per company
      const totalMs = Math.max(1, companies.length) * 2000;
      const tickMs = 100;
      let elapsed = 0;

      setIsDownloading(true);
      setProgress(0);
      setNotice('Download started…');

      const intervalId = setInterval(() => {
        elapsed += tickMs;
        const pct = Math.min(95, Math.round((elapsed / totalMs) * 100));
        setProgress(pct);
        if (elapsed >= totalMs) {
          clearInterval(intervalId);
        }
      }, tickMs);

      const res = await fetch(HR_LOOKUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companies, location }),
      });

      if (!res.ok) throw new Error('Failed to download CSV');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hr_results.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Finish progress and show complete
      setProgress(100);
      setNotice('Download complete');
      clearInterval(intervalId);
      setTimeout(() => {
        setIsDownloading(false);
        setNotice('');
        setProgress(0);
      }, 1500);
    } catch (e) {
      console.error(e);
      setNotice('Download failed');
      setProgress(0);
      setTimeout(() => setNotice(''), 2000);
      setIsDownloading(false);
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
    padding: '10px 12px',
    borderRadius: 8,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
    color: theme.colors.textPrimary,
  };

  const button = {
    padding: '10px 14px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    color: theme.colors.white,
    background: theme.colors.primary,
    transition: 'all 0.2s ease',
  };

  const card = {
    background: theme.colors.background,
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    border: `1px solid ${theme.colors.border}`,
  };

  const cardHeader = {
    background: theme.name === 'dark' ? '#0f172a' : '#1e293b',
    color: theme.colors.white,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const companyTitle = {
    fontSize: '14px',
    fontWeight: '700',
    margin: 0,
    color: theme.colors.white,
  };

  const cardBody = {
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const label = {
    color: theme.colors.textSecondary,
    fontSize: 12,
  };

  const value = {
    color: theme.colors.textPrimary,
    fontWeight: 600,
    wordBreak: 'break-word',
  };

  const hrLinkRow = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const numberBadge = {
    width: 20,
    height: 20,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.colors.secondaryBackground,
    color: theme.colors.textSecondary,
    fontSize: 12,
    flexShrink: 0,
    border: `1px solid ${theme.colors.border}`,
  };

  const progressWrap = {
    marginTop: 8,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.secondaryBackground,
    borderRadius: 8,
    overflow: 'hidden',
    height: 10,
  };

  const progressBar = {
    width: `${progress}%`,
    height: '100%',
    background: theme.colors.primary,
    transition: 'width 100ms linear',
  };

  return (
    <div style={container}>
      <div style={content}>
        <div style={header}>
          <h1 style={title}>HR Lookup</h1>
          <p style={subtitle}>Enter company names to quickly find up to three relevant HR LinkedIn profiles for each company.</p>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, color: theme.colors.textSecondary }}>Companies (one per line)</label>
          <textarea
            style={{ ...input, minHeight: 120, resize: 'vertical' }}
            value={companiesInput}
            onChange={(e) => setCompaniesInput(e.target.value)}
            placeholder={'Acme Corp\nGlobex\nUmbrella'}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, color: theme.colors.textSecondary }}>Location (optional)</label>
          <input
            style={input}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={'San Francisco, CA'}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button style={button} disabled={isLoading || companies.length === 0} onClick={handleLookup}>
            {isLoading ? 'Searching…' : 'Lookup'}
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
            >
              {isDownloading ? 'Downloading…' : 'Download CSV'}
            </button>
          )}
        </div>

        {(isDownloading || notice) && (
          <div style={{ marginTop: 6 }}>
            <div style={{ color: theme.colors.textSecondary, marginBottom: 6 }}>
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
          <div style={{ color: '#ef4444' }}>{error}</div>
        )}

        {results && results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.map((row, idx) => {
              const hrLinks = Array.isArray(row['HR LinkedIn URLs'])
                ? row['HR LinkedIn URLs']
                : (row['HR LinkedIn URL'] ? [row['HR LinkedIn URL']] : []);
              return (
                <div key={idx} style={card}>
                  <div style={cardHeader}>
                    <span style={{ fontSize: '16px' }}>🧑‍💼</span>
                    <h3 style={companyTitle}>{row['Company Name'] || 'Unknown Company'}</h3>
                  </div>
                  <div style={cardBody}>
                    <div>
                      <div style={label}>HR LinkedIn Profiles</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {hrLinks.length > 0 ? hrLinks.map((url, i) => (
                          <div key={i} style={hrLinkRow}>
                            <span style={numberBadge}>{i + 1}</span>
                            <a href={url} target="_blank" rel="noreferrer">{url}</a>
                          </div>
                        )) : (
                          <span style={{ color: theme.colors.textSecondary }}>No HR profiles found</span>
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


