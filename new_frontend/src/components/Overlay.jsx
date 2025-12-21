// frontend/src/components/Overlay.jsx
"use client";

import { useRef } from "react";
import { X, Sun, Moon, FileText } from "lucide-react";
import Navigator from "./Navigator";
import ResumeModal from "./ResumeModal";
import useDraggable from "../hooks/useDraggable.jsx"; // Assumes useDraggable is created

// Import Screen Components
import GenerateKeywordsScreen from "../screens/GenerateKeywordsScreen";
import GenerateExperienceScreen from "../screens/GenerateExperienceScreen";
import GenerateCoverScreen from "../screens/GenerateCoverScreen";
import ResumeViewer from "../screens/displayUserData";
import ChatScreen from "../screens/ChatScreen";
import HRLookupScreen from "../screens/HRLookupScreen";

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

const screens = {
  keywords: <GenerateKeywordsScreen />,
  experience: <GenerateExperienceScreen />,
  summary: <GenerateCoverScreen />,
  hr: <HRLookupScreen />, 
  chat: <ChatScreen />, 
  your: <ResumeViewer />,
};

export default function Overlay({
  activeScreen,
  setActiveScreen,
  isResumeModalOpen,
  setResumeModalOpen,
  setIsHidden,
}) {
  const overlayRef = useRef(null);
  // All dragging logic is now handled by the custom hook.
  const { position, isDragging, handleMouseDown } = useDraggable(overlayRef);
  const { theme, toggleTheme } = useTheme();

  const themed = createOverlayStyles(theme);

  const toggleBtnStyle = {
    background: theme.colors.secondaryBackground,
    color: theme.colors.textPrimary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 9999,
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  };

  // The style is dynamically updated based on the hook's state.
  const dynamicOverlayStyle = {
    ...(themed.overlayStyle || overlayStyle),
    top: `${position.top}px`,
    right: `${position.right}px`,
    transition: isDragging
      ? "none"
      : "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
  };

  return (
    <>
      <style>{createCustomScrollbarStyles(theme) || customScrollbarStyles}</style>

      <div
        style={dynamicOverlayStyle}
        className="overlay-container"
        ref={overlayRef}
      >
        {/* The onMouseDown event is now handled by the hook's function */}
        <div style={themed.headerStyle || headerStyle} onMouseDown={handleMouseDown}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: theme.colors.textPrimary }}>
            AI Job Assistant
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              style={toggleBtnStyle}
              onClick={toggleTheme}
              title={theme.name === 'dark' ? 'Switch to light' : 'Switch to dark'}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.colors.background; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = theme.colors.secondaryBackground; }}
            >
              {theme.name === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              style={themed.closeButtonStyle || closeButtonStyle}
              onClick={() => setIsHidden(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.border;
                e.currentTarget.style.color = theme.colors.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.border;
                e.currentTarget.style.color = theme.colors.textSecondary;
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <Navigator
          activeScreen={activeScreen}
          onNavigate={setActiveScreen}
          onOpenResumeModal={() => setResumeModalOpen(true)}
        />

        <div className="overlay-content" style={themed.contentStyle || contentStyle}>
          {screens[activeScreen]}
        </div>

        <div
          style={{
            padding: "12px 20px",
            borderTop: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.secondaryBackground,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
       >
          <button
            onClick={() => setResumeModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s ease",
              backgroundColor: theme.colors.textPrimary,
              color: theme.colors.background,
              fontSize: 14,
              fontWeight: 600,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.textSecondary;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.textPrimary;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FileText size={16} />
            Insert Resume
          </button>
        </div>

        <div style={themed.footerStyle || footerStyle}>Powered by gemini-2.5-flash</div>
      </div>

      {isResumeModalOpen && (
        <ResumeModal onClose={() => setResumeModalOpen(false)} />
      )}
    </>
  );
}