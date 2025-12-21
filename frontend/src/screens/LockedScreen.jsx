import { useTheme } from '../context/themeContext.jsx';
import { Lock, Briefcase, FileEdit, MessageSquare, User, ClipboardList } from 'lucide-react';

const lockedFeatures = [
  { icon: Briefcase, label: 'Experience' },
  { icon: FileEdit, label: 'Summary' },
  { icon: MessageSquare, label: 'Chat' },
  { icon: User, label: 'Resume' },
  { icon: ClipboardList, label: 'Applied' },
];

const LockedScreen = ({ featureName }) => {
  const { theme } = useTheme();

  const containerStyle = {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: theme.colors.background,
  };

  const contentStyle = {
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  };

  const headerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  };

  const lockIconStyle = {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: theme.colors.secondaryBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${theme.colors.border}`,
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.colors.textPrimary,
    margin: 0,
    letterSpacing: '-0.02em',
  };

  const subtitleStyle = {
    fontSize: '13px',
    color: theme.colors.textSecondary,
    margin: 0,
    lineHeight: '1.5',
  };

  const featuresGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    width: '100%',
    marginTop: '8px',
  };

  const featureCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 10px',
    borderRadius: '12px',
    background: theme.colors.secondaryBackground,
    border: `1px solid ${theme.colors.border}`,
    transition: 'all 0.2s ease',
    cursor: 'default',
  };

  const featureIconStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
  };

  const featureLabelStyle = {
    fontSize: '11px',
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: '0.01em',
  };

  const unlockTextStyle = {
    fontSize: '12px',
    color: theme.colors.textSecondary,
    marginTop: '8px',
    fontWeight: '500',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <div style={lockIconStyle}>
            <Lock size={28} color={theme.colors.textSecondary} strokeWidth={2.5} />
          </div>
          <h1 style={titleStyle}>Premium Feature</h1>
          <p style={subtitleStyle}>Unlock AI-powered tools</p>
        </div>

        <div style={{ width: '100%' }}>
          <div style={featuresGridStyle}>
            {lockedFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.label}
                  style={featureCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)';
                    e.currentTarget.style.borderColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = theme.colors.border;
                  }}
                >
                  <div style={featureIconStyle}>
                    <Icon 
                      size={20} 
                      color="white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span style={featureLabelStyle}>{feature.label}</span>
                </div>
              );
            })}
          </div>
          <p style={unlockTextStyle}>Upgrade to unlock</p>
        </div>
      </div>
    </div>
  );
};

export default LockedScreen;

