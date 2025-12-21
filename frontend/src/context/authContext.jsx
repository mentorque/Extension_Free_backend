import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load API key and user data from chrome.storage on mount
  useEffect(() => {
    chrome.storage.local.get(['apiKey', 'user'], (result) => {
      if (result.apiKey) {
        setApiKey(result.apiKey);
      }
      if (result.user) {
        setUser(result.user);
      }
      setIsLoading(false);
    });
  }, []);

  const login = (key, userData = null) => {
    return new Promise((resolve, reject) => {
      const dataToStore = { apiKey: key };
      if (userData) {
        dataToStore.user = userData;
      }
      chrome.storage.local.set(dataToStore, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          setApiKey(key);
          if (userData) {
            setUser(userData);
          }
          resolve();
        }
      });
    });
  };

  const logout = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(['apiKey', 'user'], () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          setApiKey(null);
          setUser(null);
          resolve();
        }
      });
    });
  };

  const value = {
    apiKey,
    user,
    isAuthenticated: !!apiKey,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};