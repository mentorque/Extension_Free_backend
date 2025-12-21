// src/components/styles.js

export const theme = {
  colors: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    background: '#ffffff',
    secondaryBackground: '#f8fafc',
    border: '#e2e8f0',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    white: '#ffffff',
    danger: '#dc2626',
    dangerBackground: '#fef2f2',
  },
  borderRadius: {
    medium: '8px',
    large: '16px',
    full: '50%',
  },
  shadows: {
    subtle: '0 2px 8px rgba(0, 0, 0, 0.05)',
    medium: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  font: {
    family: 'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  },
};

export const overlayStyle = {
  position: "fixed",
  width: "min(400px, 90vw)",
  height: "calc(100vh - 40px)",
  maxHeight: "700px",
  background: theme.colors.background,
  borderRadius: theme.borderRadius.large,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadows.medium,
  zIndex: 10001,
  pointerEvents: "auto",
  display: "flex",
  flexDirection: "column",
  fontFamily: theme.font.family,
  transform: "scale(1)",
  opacity: 1,
};

export const contentStyle = {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  padding: "24px",
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
  boxSizing: "border-box",
  scrollbarWidth: "thin",
  scrollbarColor: `${theme.colors.border} transparent`,
};

export const headerStyle = {
  background: theme.colors.secondaryBackground,
  color: theme.colors.textPrimary,
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexShrink: 0,
  borderBottom: `1px solid ${theme.colors.border}`,
  cursor: "grab",
  userSelect: "none",
  borderTopLeftRadius: theme.borderRadius.large,
  borderTopRightRadius: theme.borderRadius.large,
};

export const closeButtonStyle = {
  background: theme.colors.border,
  border: "none",
  color: theme.colors.textSecondary,
  cursor: "pointer",
  borderRadius: theme.borderRadius.full,
  width: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.2s ease, color 0.2s ease",
};

export const footerStyle = {
  padding: "8px 24px",
  textAlign: "center",
  fontSize: "12px",
  color: "#94a3b8",
  borderTop: `1px solid ${theme.colors.border}`,
  flexShrink: 0,
};

export const customScrollbarStyles = `
    .overlay-content::-webkit-scrollbar {
      width: 8px;
    }
    .overlay-content::-webkit-scrollbar-track {
      background: transparent;
    }
    .overlay-content::-webkit-scrollbar-thumb {
      background: ${theme.colors.border};
      border-radius: 4px;
    }
    .overlay-content::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.02);
        opacity: 0.9;
      }
    }

    @keyframes thinkingDot1 {
      0%, 60%, 100% {
        transform: scale(1);
        opacity: 0.3;
      }
      30% {
        transform: scale(1.3);
        opacity: 1;
      }
    }

    @keyframes thinkingDot2 {
      0%, 60%, 100% {
        transform: scale(1);
        opacity: 0.3;
      }
      30% {
        transform: scale(1.3);
        opacity: 1;
      }
    }

    @keyframes thinkingDot3 {
      0%, 60%, 100% {
        transform: scale(1);
        opacity: 0.3;
      }
      30% {
        transform: scale(1.3);
        opacity: 1;
      }
    }

    @media (max-width: 600px) {
      .overlay-container {
        width: 100vw;
        height: 100vh;
        max-height: 100vh;
        border-radius: 0;
        top: 0 !important;
        right: 0 !important;
        left: 0 !important;
        bottom: 0 !important;
      }
    }
  `;

// Dynamic style creators (theme-aware)
export const createOverlayStyles = (t) => ({
  overlayStyle: {
    position: "fixed",
    width: "min(400px, 90vw)",
    height: "calc(100vh - 40px)",
    maxHeight: "700px",
    background: t.colors.background,
    borderRadius: theme.borderRadius.large,
    border: `1px solid ${t.colors.border}`,
    boxShadow: theme.shadows.medium,
    zIndex: 10001,
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
    fontFamily: theme.font.family,
    transform: "scale(1)",
    opacity: 1,
  },
  contentStyle: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "24px",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    boxSizing: "border-box",
    scrollbarWidth: "thin",
    scrollbarColor: `${t.colors.border} transparent`,
    background: t.colors.background,
    color: t.colors.textPrimary,
  },
  headerStyle: {
    background: t.colors.secondaryBackground,
    color: t.colors.textPrimary,
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
    borderBottom: `1px solid ${t.colors.border}`,
    cursor: "grab",
    userSelect: "none",
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
  },
  closeButtonStyle: {
    background: t.colors.border,
    border: "none",
    color: t.colors.textSecondary,
    cursor: "pointer",
    borderRadius: theme.borderRadius.full,
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s ease, color 0.2s ease",
  },
  footerStyle: {
    padding: "8px 24px",
    textAlign: "center",
    fontSize: "12px",
    color: t.colors.textSecondary,
    borderTop: `1px solid ${t.colors.border}`,
    flexShrink: 0,
  }
});

export const createCustomScrollbarStyles = (t) => `
  .overlay-content::-webkit-scrollbar { width: 8px; }
  .overlay-content::-webkit-scrollbar-track { background: transparent; }
  .overlay-content::-webkit-scrollbar-thumb { background: ${t.colors.border}; border-radius: 4px; }
  .overlay-content::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
`;