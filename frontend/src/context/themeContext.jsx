import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LIGHT_THEME = {
  name: 'light',
  colors: {
    primary: '#f97316', // Orange from landing page
    primaryHover: '#ea580c',
    background: '#ffffff',
    secondaryBackground: '#f8fafc',
    border: '#e2e8f0',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    white: '#ffffff',
    danger: '#dc2626',
    dangerBackground: '#fef2f2'
  }
};

const DARK_THEME = {
  name: 'dark',
  colors: {
    primary: '#f97316', // Orange from landing page
    primaryHover: '#ea580c',
    background: '#0b1220',
    secondaryBackground: '#111827',
    border: '#1f2a44',
    textPrimary: '#e5e7eb',
    textSecondary: '#94a3b8',
    white: '#ffffff',
    danger: '#f87171',
    dangerBackground: 'rgba(248,113,113,0.1)'
  }
};

const ThemeContext = createContext({ theme: LIGHT_THEME, toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  const getInitial = () => {
    try {
      const saved = localStorage.getItem('ai_job_theme');
      if (saved) return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (_) {
      return 'light';
    }
  };

  const [mode, setMode] = useState(getInitial);

  useEffect(() => {
    try { localStorage.setItem('ai_job_theme', mode); } catch (_) {}
  }, [mode]);

  const theme = useMemo(() => (mode === 'dark' ? DARK_THEME : LIGHT_THEME), [mode]);

  const toggleTheme = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  // Apply to container root to allow global overrides if needed
  useEffect(() => {
    const root = document.getElementById('linkedin-jd-overlay');
    if (root) {
      root.setAttribute('data-theme', theme.name);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);


