// frontend/src/Entry.jsx
import { useState, useEffect } from "react";
import Overlay from "./components/Overlay";
import { useJobData } from "./context/jobContext";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { FLOATING_BUTTON_STYLES } from "./constants";
import { useTheme } from "./context/themeContext.jsx";

const Entry = () => {
  const [activeScreen, setActiveScreen] = useState("keywords");
  const [isResumeModalOpen, setResumeModalOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const { setJobData } = useJobData();
  const { theme } = useTheme();

  useEffect(() => {
    const handleMessage = (event) => {
      if (
        event.source === window &&
        event.data.type === "JOB_DETAILS_SCRAPED"
      ) {
        console.log("Job data received in React:", event.data.data);
        setJobData(event.data.data);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setJobData]);

  const floatingButtonStyle = {
    ...FLOATING_BUTTON_STYLES,
    right: isHidden ? "0px" : "-60px",
    background: theme.colors.primary,
    color: theme.colors.white,
  };


  const handleTogglePanel = () => {
    setIsHidden(!isHidden);
  };

  return (
    <>
      {/* Theme toggle moved inside Overlay header */}
      <button
        style={floatingButtonStyle}
        onClick={handleTogglePanel}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.primary;
        }}
      >
        {isHidden ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        {isHidden && "Show AI"}
      </button>

      {!isHidden && (
        <Overlay
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          isResumeModalOpen={isResumeModalOpen}
          setResumeModalOpen={setResumeModalOpen}
          setIsHidden={setIsHidden}
        />
      )}
    </>
  );
};

export default Entry;