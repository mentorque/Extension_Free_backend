import React, { useState } from 'react';
import KeywordsTab from './components/KeywordsTab';
import ResumeTab from './components/ResumeTab';
import './App.css';

const API_KEY = 'mqk_fb51d4c9d5870efeea97974faf0a5b93a4db5110f5633601f91efe05d6c9ab2c';
const BACKEND_URL = 'http://localhost:3000';

function App() {
  const [activeTab, setActiveTab] = useState('keywords');

  return (
    <div className="app">
      <div className="header">
        <h1>🔍 NLP Service Tester</h1>
        <p>Test Keywords Analysis & Resume Extraction</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'keywords' ? 'active' : ''}`}
          onClick={() => setActiveTab('keywords')}
        >
          Keywords Analysis
        </button>
        <button
          className={`tab ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          Resume Extraction
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'keywords' && <KeywordsTab apiKey={API_KEY} backendUrl={BACKEND_URL} />}
        {activeTab === 'resume' && <ResumeTab apiKey={API_KEY} backendUrl={BACKEND_URL} />}
      </div>
    </div>
  );
}

export default App;

