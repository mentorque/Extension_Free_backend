import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PremiumLoadingAnimation = ({ loadingText = "Processing your request", theme }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress from 0 to 90% (leaving 10% for completion)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 3; // Random increment for smoother feel
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Circular gauge configuration
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme?.colors?.background || '#0A0E17',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10002,
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32,
            maxWidth: 400,
            padding: '0 32px',
          }}
        >
          {/* Circular Progress Gauge */}
          <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={theme?.name === 'dark' ? '#374151' : '#e5e7eb'}
                strokeWidth={strokeWidth}
              />
              {/* Progress circle */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={theme?.colors?.primary || '#60d5ec'}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{
                  filter: `drop-shadow(0 0 8px ${theme?.colors?.primary || '#60d5ec'}80)`,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </svg>
            
            {/* Center percentage text */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}>
              <motion.span
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: theme?.colors?.textPrimary || '#FFFFFF',
                  lineHeight: 1,
                }}
                key={Math.floor(progress)}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {Math.floor(progress)}%
              </motion.span>
              <span style={{
                fontSize: '10px',
                fontWeight: 500,
                color: theme?.colors?.textSecondary || '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Loading
              </span>
            </div>
          </div>

          {/* Loading Text */}
          <motion.div
            style={{
              fontSize: 16,
              color: theme?.colors?.textPrimary || '#FFFFFF',
              textAlign: 'center',
              fontWeight: 500,
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {loadingText}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PremiumLoadingAnimation;