// src/constants/index.js
export const API_BASE_URL = "https://nonrestricted-scarfless-alicia.ngrok-free.dev";

// NEW: Add these lines
export const GENERATE_KEYWORDS_URL = `${API_BASE_URL}/generate-keywords`;
export const UPLOAD_RESUME_URL = `${API_BASE_URL}/upload-resume`;
export const GENERATE_EXPERIENCE_URL = `${API_BASE_URL}/generate-experience`;
export const GENERATE_COVER_LETTER_URL = `${API_BASE_URL}/generate-cover-letter`;
export const CHAT_URL = `${API_BASE_URL}/chat`;
export const HR_LOOKUP_URL = `${API_BASE_URL}/hr-lookup`;

export const FLOATING_BUTTON_STYLES = {
  position: "fixed",
  top: "50%",
  right: "-60px",
  transform: "translateY(-50%)",
  zIndex: 10003,
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderTopLeftRadius: "8px",
  borderBottomLeftRadius: "8px",
  padding: "12px 15px",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

export const NAV_ITEMS = [
  { id: 'keywords', label: '🔑 Keywords' },
  { id: 'experience', label: '💼 Experience' },
  { id: 'summary', label: '📄 Summary' },
  { id: 'hr', label: '🧑‍💼 HR Lookup' },
  { id: 'chat', label: '💬 Chat' },
  { id: 'your', label: '👤 Your Data' },
];