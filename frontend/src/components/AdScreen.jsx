import React from 'react';
import { useTheme } from '../context/themeContext';
import { X, ArrowUpRight, Calendar } from 'lucide-react';

const AdScreen = ({ onClose }) => {
  const { theme } = useTheme();

  const handleViewTestimonial = () => {
    window.open('https://www.mentorquedu.com/testimonials', '_blank', 'noopener,noreferrer');
  };

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000000,
    padding: '20px',
  };

  const cardStyle = {
    backgroundColor: theme.colors.background,
    borderRadius: '24px',
    padding: '48px',
    maxWidth: '600px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 25%, #c7d2fe 50%, #a5b4fc 75%, #8b5cf6 100%)',
  };

  const titleStyle = {
    fontSize: '36px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '16px',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    lineHeight: '1.2',
  };

  const subtitleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: '8px',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  };

  const descriptionStyle = {
    fontSize: '18px',
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: '32px',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    lineHeight: '1.6',
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    padding: '16px 24px',
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#111827',
    border: 'none',
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div style={containerStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#111827',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <X size={18} />
        </button>

        <h1 style={titleStyle}>
          Land Interviews Faster.
        </h1>
        <h2 style={subtitleStyle}>
          Your Resume PortFolio
        </h2>
        <p style={descriptionStyle}>
          We make it easy. You make it happen.
        </p>

        <button
          onClick={handleViewTestimonial}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#000';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#111827';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
          }}
        >
          <Calendar size={20} />
          View Testimonial
          <ArrowUpRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default AdScreen;

