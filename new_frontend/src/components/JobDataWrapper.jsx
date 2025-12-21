// src/components/JobDataWrapper.jsx
import { useJobData } from '../context/jobContext';
import { FileText } from 'lucide-react';
import { useTheme } from '../context/themeContext.jsx';

const JobDataWrapper = ({ children }) => {
  const { jobData } = useJobData();
  const { theme } = useTheme();

  if (!jobData || !jobData.description) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        backgroundColor: theme.colors.secondaryBackground,
        borderRadius: '12px',
        padding: '20px',
        margin: '20px 0',
        border: `1px solid ${theme.colors.border}`
      }}>
        <div style={{ textAlign: 'center' }}>
          <FileText style={{ margin: '0 auto 16px', height: '48px', width: '48px', color: '#cbd5e1' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.textPrimary, marginBottom: '8px' }}>No Job Data Available</h3>
          <p style={{ fontSize: '14px', color: theme.colors.textSecondary }}>Please navigate to a job posting to see the data.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default JobDataWrapper;