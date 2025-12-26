import React, { useState } from 'react';

function KeywordsTab({ apiKey, backendUrl }) {
  const [jobDescription, setJobDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const analyzeKeywords = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter job description');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const skillsArray = skills.trim() 
        ? skills.split(',').map(s => s.trim()).filter(s => s)
        : [];

      const response = await fetch(`${backendUrl}/api/keywords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          jobDescription: jobDescription,
          skills: skillsArray
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.message || errorData.error || `Request failed: ${response.status}`);
      }

      const data = await response.json();
      // Extract result from nested structure
      setResults(data.result || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="jobDescription">Job Description (LinkedIn):</label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste LinkedIn job description here..."
        />
      </div>
      <div className="form-group">
        <label htmlFor="skills">Your Skills (comma-separated, optional):</label>
        <textarea
          id="skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g., Python, JavaScript, React, Node.js (or leave empty to extract from resume)"
        />
      </div>
      <button className="btn" onClick={analyzeKeywords} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Keywords'}
      </button>

      {error && <div className="error">Error: {error}</div>}

      {results && (
        <div className="results">
          <h3>Results</h3>
          
          {/* 1. Summary: Total Keywords Detected */}
          {(() => {
            const totalKeywords = results.extractedKeywords?.length || 
                                 results.processing_steps?.step3_normalization?.total_normalized || 
                                 (results.present_skills?.length || 0) + (results.missing_skills?.length || 0);
            const matchedCount = results.matchedSkills?.length || results.present_skills?.length || 0;
            const missingCount = results.missingSkills?.length || results.missing_skills?.length || 0;
            const matchPercentage = totalKeywords > 0 
              ? Math.round((matchedCount / totalKeywords) * 100) 
              : (results.match_percentage || 0);
            
            return totalKeywords > 0 && (
              <div style={{ 
                marginBottom: '30px', 
                padding: '20px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                color: 'white'
              }}>
                <h4 style={{ marginBottom: '20px', color: 'white', fontSize: '18px', fontWeight: '600' }}>
                  📊 Keywords Analysis Summary
                </h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '15px' 
                }}>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
                      {totalKeywords}
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Total Keywords Detected</div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
                      {matchedCount}
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Matched with Your Skills</div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
                      {missingCount}
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Missing from Your Skills</div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
                      {matchPercentage}%
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Match Percentage</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 2. Matching Results */}
          {((results.matchedSkills || results.present_skills) || (results.missingSkills || results.missing_skills)) && (
            <div style={{ marginBottom: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '20px', color: '#667eea', fontSize: '18px', fontWeight: '600' }}>
                🔍 Matching Results
              </h4>
              
              {(results.matchedSkills || results.present_skills) && (results.matchedSkills?.length > 0 || results.present_skills?.length > 0) && (
                <div style={{ marginBottom: '25px' }}>
                  <h5 style={{ marginBottom: '12px', color: '#28a745', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✅</span>
                    <span>Matched Skills ({results.matchedSkills?.length || results.present_skills?.length || 0})</span>
                  </h5>
                  <div className="keywords-grid">
                    {(results.matchedSkills || results.present_skills || []).map((skill, idx) => (
                      <div key={idx} className="keyword-tag matched">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(results.missingSkills || results.missing_skills) && (results.missingSkills?.length > 0 || results.missing_skills?.length > 0) && (
                <div>
                  <h5 style={{ marginBottom: '12px', color: '#ffc107', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚠️</span>
                    <span>Missing Skills ({results.missingSkills?.length || results.missing_skills?.length || 0})</span>
                  </h5>
                  <div className="keywords-grid">
                    {(results.missingSkills || results.missing_skills || []).map((skill, idx) => (
                      <div key={idx} className="keyword-tag missing">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. All Extracted Keywords (Collapsible) */}
          {(results.extractedKeywords || results.processing_steps?.step3_normalization?.normalized_skills) && (
            <div style={{ marginBottom: '30px' }}>
              <details style={{ 
                padding: '15px', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  color: '#667eea', 
                  fontWeight: '600', 
                  fontSize: '16px',
                  padding: '5px 0',
                  userSelect: 'none'
                }}>
                  📋 View All Extracted Keywords ({results.extractedKeywords?.length || results.processing_steps?.step3_normalization?.total_normalized || 0})
                </summary>
                <div className="keywords-grid" style={{ marginTop: '15px' }}>
                  {(results.extractedKeywords || results.processing_steps?.step3_normalization?.normalized_skills || []).map((keyword, idx) => (
                    <div key={idx} className="keyword-tag">
                      {keyword}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
          
          {/* 4. Step-by-Step Processing (Collapsible) */}
          {results.processing_steps && (
            <div style={{ marginBottom: '30px' }}>
              <details style={{ 
                padding: '15px', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  color: '#667eea', 
                  fontWeight: '600', 
                  fontSize: '16px',
                  padding: '5px 0',
                  userSelect: 'none'
                }}>
                  🔍 View Processing Steps (spaCy PhraseMatcher, Embeddings, etc.)
                </summary>
                <div style={{ marginTop: '20px' }}>
              
              {/* Step 1: PhraseMatcher - Simplified */}
              {results.processing_steps.step1_phrasematcher && (
                <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '6px' }}>
                  <h5 style={{ color: '#667eea', marginBottom: '12px', fontSize: '15px', fontWeight: '600' }}>
                    Step 1: spaCy PhraseMatcher
                  </h5>
                  {results.processing_steps.step1_phrasematcher.raw_matches && results.processing_steps.step1_phrasematcher.raw_matches.length > 0 && (
                    <div className="keywords-grid">
                      {results.processing_steps.step1_phrasematcher.raw_matches.map((match, idx) => (
                        <div key={idx} className="keyword-tag" style={{ fontSize: '12px' }}>
                          {match.skill || match.text || match}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Semantic Classification - Simplified */}
              {results.processing_steps.step2_semantic_classification && (
                <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '6px' }}>
                  <h5 style={{ color: '#667eea', marginBottom: '12px', fontSize: '15px', fontWeight: '600' }}>
                    Step 2: Semantic Classification (Embeddings)
                    {results.processing_steps.step2_semantic_classification.classifier_available && (
                      <span style={{ fontSize: '12px', color: '#28a745', marginLeft: '8px' }}>✓</span>
                    )}
                  </h5>
                  
                  {/* Important Skills */}
                  {results.processing_steps.step2_semantic_classification.important_skills && results.processing_steps.step2_semantic_classification.important_skills.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ fontSize: '13px', color: '#28a745', fontWeight: '500', marginBottom: '8px' }}>
                        Important Keywords:
                      </div>
                      <div className="keywords-grid">
                        {results.processing_steps.step2_semantic_classification.important_skills.map((skill, idx) => (
                          <div key={idx} className="keyword-tag matched">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Less Important Skills */}
                  {results.processing_steps.step2_semantic_classification.less_important_skills && results.processing_steps.step2_semantic_classification.less_important_skills.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ fontSize: '13px', color: '#f59e0b', fontWeight: '500', marginBottom: '8px' }}>
                        Less Important Keywords:
                      </div>
                      <div className="keywords-grid">
                        {results.processing_steps.step2_semantic_classification.less_important_skills.map((skill, idx) => (
                          <div key={idx} className="keyword-tag missing">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Non-Technical Skills */}
                  {results.processing_steps.step2_semantic_classification.non_technical_skills && results.processing_steps.step2_semantic_classification.non_technical_skills.length > 0 && (
                    <div>
                      <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>
                        Non-Technical Keywords:
                      </div>
                      <div className="keywords-grid">
                        {results.processing_steps.step2_semantic_classification.non_technical_skills.map((skill, idx) => (
                          <div key={idx} className="keyword-tag" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Normalization - Simplified */}
              {results.processing_steps.step3_normalization && (
                <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '6px' }}>
                  <h5 style={{ color: '#667eea', marginBottom: '12px', fontSize: '15px', fontWeight: '600' }}>
                    Step 3: Skill Normalization
                  </h5>
                  {results.processing_steps.step3_normalization.normalized_skills && results.processing_steps.step3_normalization.normalized_skills.length > 0 && (
                    <div className="keywords-grid">
                      {results.processing_steps.step3_normalization.normalized_skills.map((skill, idx) => (
                        <div key={idx} className="keyword-tag">
                          {skill}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Matching - Already shown in Matching Results section, so skip here */}
                </div>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default KeywordsTab;

