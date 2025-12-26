import React, { useState } from 'react';
import { useTheme } from '../context/themeContext';
import { X, User, Mail, Phone, Briefcase } from 'lucide-react';
import { apiClient } from '../utils/apiClient';
import config from '../config';

const UserInfoForm = ({ onClose, onSuccess, required = false }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    occupation: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.post(
        `${config.apiBaseUrl}/freetrial/register`,
        formData
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
      }

      const data = await response.json();
      
      // Store in localStorage
      localStorage.setItem('freetrialUserSubmitted', 'true');
      localStorage.setItem('freetrialUserData', JSON.stringify(data.data));
      
      if (onSuccess) {
        onSuccess(data.data);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('[UserInfoForm] Registration error:', error);
      setErrors({ submit: error.message || 'Failed to register. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
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

  const formStyle = {
    backgroundColor: theme.colors.background,
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    position: 'relative',
  };

  const inputGroupStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    borderRadius: '8px',
    border: `1px solid ${errors.name || errors.email || errors.contactNumber ? '#ef4444' : theme.colors.border}`,
    backgroundColor: theme.colors.secondaryBackground,
    color: theme.colors.textPrimary,
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    outline: 'none',
    transition: 'all 0.2s',
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#f97316', // Orange from landing page
    border: 'none',
    borderRadius: '12px',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    opacity: isSubmitting ? 0.7 : 1,
    transition: 'all 0.2s',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
  };

  return (
    <div style={containerStyle} onClick={(e) => {
      if (!required && e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <form style={formStyle} onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        {!required && (
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: theme.colors.textSecondary,
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        )}

        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.colors.textPrimary,
          marginBottom: '8px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}>
          Get Started
        </h2>
        <p style={{
          fontSize: '14px',
          color: theme.colors.textSecondary,
          marginBottom: '24px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}>
          Please provide your information to continue using the extension
        </p>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>
            <User size={16} />
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            style={inputStyle}
            required
          />
          {errors.name && <div style={errorStyle}>{errors.name}</div>}
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>
            <Mail size={16} />
            Email ID *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            style={inputStyle}
            required
          />
          {errors.email && <div style={errorStyle}>{errors.email}</div>}
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>
            <Phone size={16} />
            Contact Number *
          </label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter your contact number"
            style={inputStyle}
            required
          />
          {errors.contactNumber && <div style={errorStyle}>{errors.contactNumber}</div>}
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>
            <Briefcase size={16} />
            Occupation
          </label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="Enter your occupation (optional)"
            style={inputStyle}
          />
        </div>

        {errors.submit && (
          <div style={{ ...errorStyle, marginBottom: '16px' }}>{errors.submit}</div>
        )}

        <button
          type="submit"
          style={buttonStyle}
          disabled={isSubmitting}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = '#ea580c';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = '#f97316';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.3)';
            }
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default UserInfoForm;

