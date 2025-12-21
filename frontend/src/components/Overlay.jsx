// frontend/src/components/Overlay.jsx
"use client";

import { useRef, useState, useEffect } from "react";
import { X, Sun, Moon, FileText, Sparkles, Briefcase, FileEdit, Users, MessageSquare, User, UserCircle, ClipboardList, LayoutDashboard, Lock } from "lucide-react";
import { useAuth } from "../context/authContext.jsx";
import { useJobData } from "../context/jobContext.jsx";
import ResumeModal from "./ResumeModal";
import useDraggable from "../hooks/useDraggable.jsx";
import { apiClient } from "../utils/apiClient.js";

// Import Screen Components - Lazy loaded for better performance
import GenerateKeywordsScreen from "../screens/GenerateKeywordsScreen";
import GenerateExperienceScreen from "../screens/GenerateExperienceScreen";
import GenerateCoverScreen from "../screens/GenerateCoverScreen";
import ResumeViewer from "../screens/displayUserData";
import ChatScreen from "../screens/ChatScreen";
import HRLookupScreen from "../screens/HRLookupScreen";
import AppliedJobsScreen from "../screens/AppliedJobsScreen";
import LockedScreen from "../screens/LockedScreen";

import {
  overlayStyle,
  contentStyle,
  headerStyle,
  closeButtonStyle,
  footerStyle,
  customScrollbarStyles,
  createOverlayStyles,
  createCustomScrollbarStyles,
} from "./styles";
import { useTheme } from "../context/themeContext.jsx";

// Screen component map - components are created lazily when needed
const screenComponents = {
  keywords: GenerateKeywordsScreen,
  experience: GenerateExperienceScreen,
  summary: GenerateCoverScreen,
  hr: HRLookupScreen,
  chat: ChatScreen,
  your: ResumeViewer,
  applied: AppliedJobsScreen,
};

const navItems = [
  { key: "your", icon: User, label: "Resume", locked: false },
  { key: "keywords", icon: Sparkles, label: "Keywords", locked: false },
  { key: "hr", icon: Users, label: "HR Lookup", locked: false },
  { key: "experience", icon: Briefcase, label: "Experience", locked: true },
  { key: "summary", icon: FileEdit, label: "Summary", locked: true },
  { key: "chat", icon: MessageSquare, label: "Chat", locked: true },
  { key: "applied", icon: ClipboardList, label: "Applied", locked: true }
];

export default function Overlay({
  activeScreen,
  setActiveScreen,
  isResumeModalOpen,
  setResumeModalOpen,
  setIsHidden,
}) {
  const overlayRef = useRef(null);
  const dropdownRef = useRef(null);
  const { position, isDragging, handleMouseDown } = useDraggable(overlayRef);
  const { theme, toggleTheme } = useTheme();
  const { logout, user, apiKey } = useAuth();
  const { jobData, appliedJobs, setAppliedJobs } = useJobData();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserDropdown]);

  const themed = createOverlayStyles(theme);

  const premiumOverlayStyle = {
    position: "fixed",
    top: `${position.top}px`,
    right: `${position.right}px`,
    width: "min(460px, 90vw)",
    height: "calc(100vh - 40px)",
    maxHeight: "700px",
    transition: isDragging
      ? "none"
      : "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: isDragging 
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      : "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(20px)",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 16,
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    zIndex: 10001,
    pointerEvents: "auto",
    fontFamily: "Outfit, sans-serif",
  };

  const sidebarStyle = {
    width: 72,
    backgroundColor: theme.colors.secondaryBackground,
    borderRight: `1px solid ${theme.colors.border}`,
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  };

  const mainContentStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.colors.background,
    overflow: "hidden",
  };

  const premiumHeaderStyle = {
    padding: "16px 20px",
    borderBottom: `1px solid ${theme.colors.border}`,
    background: `linear-gradient(to bottom, ${theme.colors.background}, ${theme.colors.secondaryBackground})`,
    cursor: "move",
    userSelect: "none",
    flexShrink: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const premiumContentStyle = {
    padding: "20px",
    overflowY: "auto",
    overflowX: "hidden",
    flex: 1,
    minHeight: 0,
  };

  const navItemStyle = (isActive) => ({
    width: "100%",
    height: 64,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: isActive ? theme.colors.background : "transparent",
    borderLeft: isActive ? `3px solid ${theme.colors.textPrimary}` : "3px solid transparent",
    position: "relative",
  });

  const iconWrapperStyle = (isActive, isLocked) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: isActive ? `${theme.colors.textPrimary}10` : "transparent",
    transition: "all 0.2s ease",
    opacity: isLocked && !isActive ? 0.6 : 1,
  });

  const labelStyle = {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.02em",
    color: theme.colors.textSecondary,
    transition: "color 0.2s ease",
  };

  const iconButtonStyle = {
    background: "transparent",
    color: theme.colors.textSecondary,
    border: "none",
    borderRadius: 8,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const primaryButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "11px 20px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: theme.colors.textPrimary,
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    width: "100%",
  };

  const secondaryButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "11px 20px",
    borderRadius: 10,
    border: `1px solid ${theme.colors.border}`,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    width: "100%",
  };


  const footerContainerStyle = {
    padding: "14px 20px",
    borderTop: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.secondaryBackground,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    flexShrink: 0,
  };

  const premiumFooterStyle = {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.02em",
    opacity: 0.5,
    transition: "opacity 0.2s ease",
    textAlign: "center",
    color: theme.colors.textSecondary,
  };

  const customScrollbar = `
    .overlay-content::-webkit-scrollbar {
      width: 6px;
    }
    
    .overlay-content::-webkit-scrollbar-track {
      background: transparent;
      margin: 8px 0;
    }
    
    .overlay-content::-webkit-scrollbar-thumb {
      background: ${theme.colors.border};
      border-radius: 10px;
      transition: background 0.2s ease;
    }
    
    .overlay-content::-webkit-scrollbar-thumb:hover {
      background: ${theme.colors.textSecondary};
    }

    .overlay-content {
      scrollbar-width: thin;
      scrollbar-color: ${theme.colors.border} transparent;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 600px) {
      .overlay-container {
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
        top: 0 !important;
        right: 0 !important;
      }
    }
  `;

  return (
    <>
      <style>{customScrollbar}</style>

      <div
        style={premiumOverlayStyle}
        className="overlay-container"
        ref={overlayRef}
      >
        {/* Sidebar Navigation */}
        <div style={sidebarStyle}>
          <div 
            style={{
              height: 57,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: `1px solid ${theme.colors.border}`,
            }}
            onMouseDown={handleMouseDown}
          >
       <div
  style={{
    width: 32,
    height: 32,
    borderRadius: 8,
    background: theme.colors.background,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.textPrimary,
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: "-0.02em",
    cursor: "move",
    border: `1px solid ${theme.colors.border}`,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  }}
>
  <div
    style={{
      width: 20,
      height: 20,
      backgroundColor: theme.colors.textPrimary,
      borderRadius: 4,
    }}
  />
</div>
          </div>

          <div style={{ flex: 1, paddingTop: 8 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.key;
              const isLocked = item.locked;
              return (
                <div
                  key={item.key}
                  style={navItemStyle(isActive)}
                  onClick={() => setActiveScreen(item.key)}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = `${theme.colors.background}80`;
                    }
                    const label = e.currentTarget.querySelector('.nav-label');
                    if (label) label.style.color = theme.colors.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                    const label = e.currentTarget.querySelector('.nav-label');
                    if (label && !isActive) label.style.color = theme.colors.textSecondary;
                  }}
                >
                  <div style={{
                    ...iconWrapperStyle(isActive, isLocked),
                    position: 'relative'
                  }}>
                    <Icon 
                      size={18} 
                      color={isActive ? theme.colors.textPrimary : theme.colors.textSecondary}
                      strokeWidth={2.5}
                    />
                    {isLocked && (
                      <div style={{
                        position: 'absolute',
                        bottom: -3,
                        right: -3,
                        width: '16px',
                        height: '16px',
                        backgroundColor: theme.colors.background,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${theme.colors.border}`,
                        boxShadow: `0 2px 4px rgba(0, 0, 0, 0.15)`,
                        zIndex: 10
                      }}>
                        <Lock 
                          size={9} 
                          color={theme.colors.textSecondary}
                          strokeWidth={2.5}
                        />
                      </div>
                    )}
                  </div>
                  <span 
                    className="nav-label"
                    style={{
                      ...labelStyle,
                      color: isActive ? theme.colors.textPrimary : (isLocked ? theme.colors.textSecondary : theme.colors.textSecondary),
                      opacity: isLocked && !isActive ? 0.7 : 1,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={mainContentStyle}>
          <div style={premiumHeaderStyle} onMouseDown={handleMouseDown}>
            <h2 
              style={{ 
                margin: 0, 
                fontSize: "17px", 
                fontWeight: "600", 
                color: theme.colors.textPrimary,
                letterSpacing: "-0.02em",
              }}
            >
              {navItems.find(item => item.key === activeScreen)?.label || "AI Job Assistant"}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
              <button
                style={iconButtonStyle}
                onClick={toggleTheme}
                title={theme.name === "dark" ? "Switch to light" : "Switch to dark"}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.secondaryBackground;
                  e.currentTarget.style.color = theme.colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }}
              >
                {theme.name === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              
              {/* Dashboard Button */}
              <button
                style={iconButtonStyle}
                onClick={() => window.open('https://app.mentorquedu.com/dashboard', '_blank')}
                title="Dashboard"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.secondaryBackground;
                  e.currentTarget.style.color = theme.colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }}
              >
                <LayoutDashboard size={16} />
              </button>

              {/* User Profile Icon */}
              <button
                style={iconButtonStyle}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                title="User Profile"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.secondaryBackground;
                  e.currentTarget.style.color = theme.colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }}
              >
                <UserCircle size={16} />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div ref={dropdownRef} style={{
                  position: "absolute",
                  top: "40px",
                  right: "0",
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  padding: "16px",
                  minWidth: "240px",
                  zIndex: 10003,
                  animation: "slideDown 0.2s ease-out"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                    paddingBottom: "12px",
                    borderBottom: `1px solid ${theme.colors.border}`
                  }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: theme.colors.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: theme.colors.white
                    }}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: theme.colors.textPrimary,
                        marginBottom: "2px"
                      }}>
                        {user?.name || 'User'}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: theme.colors.textSecondary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {user?.email || 'No email'}
                      </div>
                    </div>
                  </div>
                  
                  {jobData?.title && (
                    <div style={{
                      padding: "4px",
                      backgroundColor: theme.colors.secondaryBackground,
                      borderRadius: "4px",
                      marginBottom: "4px",
                      width: "100%"
                    }}>
                      <div style={{
                        fontSize: "8px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: theme.colors.textSecondary,
                        marginBottom: "2px"
                      }}>
                        JOB ROLE YOU ARE LOOKIN AT
                      </div>
                      <div style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        color: theme.colors.textPrimary,
                        lineHeight: "1.3"
                      }}>
                        {jobData.title}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                style={{
                  ...iconButtonStyle,
                  width: 'auto',
                  padding: '0 10px',
                  border: `1px solid ${theme.colors.border}`
                }}
                onClick={async () => {
                  try {
                    await logout();
                    setIsHidden(true);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                title="Logout"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.secondaryBackground;
                  e.currentTarget.style.color = theme.colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }}
              >
                Logout
              </button>
              <button
                style={iconButtonStyle}
                onClick={() => setIsHidden(true)}
                title="Hide assistant"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.secondaryBackground;
                  e.currentTarget.style.color = theme.colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="overlay-content" style={premiumContentStyle}>
            {(() => {
              const activeNavItem = navItems.find(item => item.key === activeScreen);
              const isLocked = activeNavItem?.locked;
              
              if (isLocked) {
                return <LockedScreen featureName={activeNavItem?.label} />;
              }
              
              const ScreenComponent = screenComponents[activeScreen];
              if (!ScreenComponent) {
                return <div style={{ padding: '20px', textAlign: 'center', color: theme.colors.textSecondary }}>
                  Screen not found
                </div>;
              }
              // Only render the active screen component - lazy loading prevents unnecessary API calls
              return <ScreenComponent key={activeScreen} />;
            })()}
          </div>

          <div style={footerContainerStyle}>
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <button
                onClick={() => setResumeModalOpen(true)}
                style={primaryButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <FileText size={16} />
                Insert Resume
              </button>
            </div>

            <div 
              style={premiumFooterStyle}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
            >
              Powered by gemini-2.5-flash
            </div>
          </div>
        </div>
      </div>

      {isResumeModalOpen && (
        <ResumeModal onClose={() => setResumeModalOpen(false)} />
      )}
    </>
  );
}