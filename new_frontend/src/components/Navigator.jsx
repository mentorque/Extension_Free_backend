// frontend/src/components/Navigator.jsx
import { useTheme } from '../context/themeContext.jsx';
import { FileSearch, Briefcase, FileText, MessageSquare, User, BriefcaseBusiness } from 'lucide-react';

const navigationItems = [
  { id: 'keywords', label: 'Keywords', description: 'Generate keywords', icon: FileSearch },
  { id: 'experience', label: 'Experience', description: 'Add experience', icon: Briefcase },
  { id: 'summary', label: 'Summary', description: 'Create summary', icon: FileText },
  { id: 'hr', label: 'HR Lookup', description: 'Find HR contacts', icon: BriefcaseBusiness },
  { id: 'chat', label: 'Chat', description: 'AI assistant', icon: MessageSquare },
  { id: 'your', label: 'Preview', description: 'View resume', icon: User },
];

const Navigator = ({ onNavigate, onOpenResumeModal, activeScreen }) => {
  const { theme } = useTheme();

  const containerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 20px',
    background: theme.colors.background,
    borderBottom: `1px solid ${theme.colors.border}`,
    overflowX: 'auto',
    whiteSpace: 'nowrap',
  };

  const navItemStyles = (isActive) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: isActive ? theme.colors.border : 'transparent',
    color: isActive ? theme.colors.textPrimary : theme.colors.textSecondary,
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '500',
  });

  return (
    <nav style={containerStyles}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        return (
          <button
            key={item.id}
            style={navItemStyles(isActive)}
            onClick={() => onNavigate(item.id)}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = theme.colors.border;
                e.currentTarget.style.color = theme.colors.textPrimary;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.colors.textSecondary;
              }
            }}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigator;