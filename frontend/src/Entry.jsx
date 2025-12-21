// src/Entry.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import Overlay from "./components/Overlay.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import { useAuth } from "./context/authContext.jsx";

const getButtonPosition = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const savedPosition = localStorage.getItem("buttonPosition");
      return savedPosition ? JSON.parse(savedPosition) : null;
    } catch (error) {
      console.error('Error loading button position:', error);
      return null;
    }
  }
  return null;
};

const saveButtonPosition = (position) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem("buttonPosition", JSON.stringify(position));
    } catch (error) {
      console.error('Error saving button position:', error);
    }
  }
};

export default function Entry() {
  const { apiKey, isAuthenticated, isLoading } = useAuth();
  const [isHidden, setIsHidden] = useState(true);
  const [activeScreen, setActiveScreen] = useState("keywords");
  const [isResumeModalOpen, setResumeModalOpen] = useState(false);
  const buttonRef = useRef(null);
  const hasMovedRef = useRef(false);
  const [buttonPosition, setButtonPosition] = useState({ top: "50%", right: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Load saved position
  useEffect(() => {
    const savedPosition = getButtonPosition();
    if (savedPosition) {
      // Normalize right position - convert "0px" string to 0 number, or keep number
      const normalizedRight = typeof savedPosition.right === 'string' 
        ? parseFloat(savedPosition.right.replace('px', '')) || 0
        : savedPosition.right || 0;
      // Snap to right edge if very close (within 5px)
      const snappedRight = normalizedRight <= 5 ? 0 : normalizedRight;
      setButtonPosition({ 
        ...savedPosition, 
        right: snappedRight 
      });
    } else {
      // Default position: center vertically, right edge
      setButtonPosition({ top: "50%", right: 0 });
    }
  }, []);

  // Save position when it changes
  useEffect(() => {
    saveButtonPosition(buttonPosition);
  }, [buttonPosition]);

  const handleMouseDown = (e) => {
    if (e.button !== 0 || !buttonRef.current) return;
    hasMovedRef.current = false;
    setIsDragging(true);
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const offset = {
      x: e.clientX - buttonRect.left,
      y: e.clientY - buttonRect.top,
    };
    setDragOffset(offset);
    setStartPos({ x: e.clientX, y: e.clientY });
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !buttonRef.current) return;
    
    // Check if mouse has moved significantly
    const moveThreshold = 5;
    const deltaX = Math.abs(e.clientX - startPos.x);
    const deltaY = Math.abs(e.clientY - startPos.y);
    
    if (deltaX > moveThreshold || deltaY > moveThreshold) {
      hasMovedRef.current = true;
    }
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const buttonWidth = buttonRef.current.offsetWidth;
    const buttonHeight = buttonRef.current.offsetHeight;

    let newLeft = e.clientX - dragOffset.x;
    let newTop = e.clientY - dragOffset.y;

    // Constrain to viewport
    newLeft = Math.max(0, Math.min(newLeft, windowWidth - buttonWidth));
    newTop = Math.max(0, Math.min(newTop, windowHeight - buttonHeight));

    let newRight = windowWidth - (newLeft + buttonWidth);
    // Snap to right edge if very close (within 5px)
    if (newRight <= 5) {
      newRight = 0;
    }
    setButtonPosition({ 
      top: `${newTop}px`, 
      right: newRight 
    });
  }, [isDragging, dragOffset, startPos]);

  const handleMouseUp = useCallback((e) => {
    if (isDragging) {
      const wasDragging = hasMovedRef.current;
      setIsDragging(false);
      
      // If we didn't move much, treat it as a click
      if (!wasDragging) {
        setIsHidden(false);
      }
      
      hasMovedRef.current = false;
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleClick = (e) => {
    // Prevent click if we were dragging
    if (hasMovedRef.current || isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setIsHidden(false);
  };

  // Show floating AI button when hidden
  if (isHidden) {
    return (
      <button
        ref={buttonRef}
        aria-label="Open Mentorque AI Job Assistant - Trial"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        style={{
          position: "fixed",
          top: buttonPosition.top,
          right: typeof buttonPosition.right === 'number' ? `${buttonPosition.right}px` : (buttonPosition.right || '0px'),
          transform: buttonPosition.top === "50%" ? "translateY(-50%)" : "none",
          zIndex: 999999,
          background: "linear-gradient(135deg, #0073b1, #00a0dc)",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "8px 0 0 8px",
          padding: "12px 14px",
          cursor: isDragging ? "grabbing" : "grab",
          fontSize: "14px",
          fontWeight: "600",
          boxShadow: isDragging 
            ? "0 16px 40px rgba(0, 115, 177, 0.5)" 
            : "0 10px 25px rgba(0, 115, 177, 0.35)",
          transition: isDragging 
            ? "none" 
            : "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #006097, #0088cc)";
            if (buttonPosition.top === "50%") {
              e.currentTarget.style.transform = "translateY(-50%) translateY(-2px) scale(1.03)";
            } else {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
            }
            e.currentTarget.style.boxShadow =
              "0 16px 30px rgba(0, 115, 177, 0.45)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #0073b1, #00a0dc)";
            if (buttonPosition.top === "50%") {
              e.currentTarget.style.transform = "translateY(-50%)";
            } else {
              e.currentTarget.style.transform = "none";
            }
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 115, 177, 0.35)";
          }
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            backgroundColor: "white",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#000",
              borderRadius: 2,
            }}
          />
        </div>
        <span style={{ lineHeight: 1 }}>Mentorque AI Job Assistant - Trial</span>
      </button>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 999999,
          background: "white",
          padding: "12px 20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onClose={() => setIsHidden(true)} />;
  }

  // Show main overlay when authenticated
  return (
    <Overlay
      userData={{ apiKey }}
      onLogout={() => {}}
      isHidden={isHidden}
      setIsHidden={setIsHidden}
      activeScreen={activeScreen}
      setActiveScreen={setActiveScreen}
      isResumeModalOpen={isResumeModalOpen}
      setResumeModalOpen={setResumeModalOpen}
    />
  );
}
