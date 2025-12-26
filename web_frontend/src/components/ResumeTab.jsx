import React, { useState } from 'react';

function ResumeTab({ apiKey, backendUrl }) {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const extractResume = async () => {
    if (!resumeText.trim()) {
      alert('Please paste resume content');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${backendUrl}/api/upload-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          resumeText: resumeText
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
      setResults(data);

      // Auto-fill skills in keywords tab if available
      if (data.result && data.result.formatted_resume && data.result.formatted_resume.skills) {
        const skillsInput = document.getElementById('skills');
        if (skillsInput && !skillsInput.value.trim()) {
          skillsInput.value = data.result.formatted_resume.skills.join(', ');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="resumeText">Paste Resume Content:</label>
        <textarea
          id="resumeText"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume text here..."
        />
      </div>
      <button className="btn" onClick={extractResume} disabled={loading}>
        {loading ? 'Extracting...' : 'Extract Resume'}
      </button>

      {error && <div className="error">Error: {error}</div>}

      {results && results.result && results.result.formatted_resume && (
        <div className="results">
          <h3>Extracted Resume Data</h3>
          <div className="resume-data">
            {/* Display all skills with 3-section classification */}
            {results.result.formatted_resume.skills_classified && (
              <>
                {/* Summary Stats */}
                {(() => {
                  const important = results.result.formatted_resume.skills_classified.important?.length || 0;
                  const lessImportant = results.result.formatted_resume.skills_classified.less_important?.length || 0;
                  const nonTechnical = results.result.formatted_resume.skills_classified.non_technical?.length || 0;
                  const total = important + lessImportant + nonTechnical;
                  
                  return total > 0 && (
                    <div style={{ 
                      marginBottom: '20px', 
                      padding: '15px', 
                      background: '#f8f9fa', 
                      borderRadius: '6px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '10px'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                          {important}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Important</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                          {lessImportant}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Less Important</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6c757d' }}>
                          {nonTechnical}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Non-Technical</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                          {total}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Total Skills</div>
                      </div>
                    </div>
                  );
                })()}
                {/* Important Skills */}
                {results.result.formatted_resume.skills_classified.important && 
                 results.result.formatted_resume.skills_classified.important.length > 0 && (
                  <div className="resume-section">
                    <h4 style={{ color: '#28a745', marginBottom: '10px' }}>
                      ✅ Important Skills ({results.result.formatted_resume.skills_classified.important.length}):
                    </h4>
                    <div className="keywords-grid">
                      {results.result.formatted_resume.skills_classified.important.map((skill, idx) => (
                        <div key={idx} className="keyword-tag matched">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Less Important Skills */}
                {results.result.formatted_resume.skills_classified.less_important && 
                 results.result.formatted_resume.skills_classified.less_important.length > 0 && (
                  <div className="resume-section">
                    <h4 style={{ color: '#ffc107', marginBottom: '10px' }}>
                      ⚠️ Less Important Skills ({results.result.formatted_resume.skills_classified.less_important.length}):
                    </h4>
                    <div className="keywords-grid">
                      {results.result.formatted_resume.skills_classified.less_important.map((skill, idx) => (
                        <div key={idx} className="keyword-tag missing">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Non-Technical Skills */}
                {results.result.formatted_resume.skills_classified.non_technical && 
                 results.result.formatted_resume.skills_classified.non_technical.length > 0 && (
                  <div className="resume-section">
                    <h4 style={{ color: '#6c757d', marginBottom: '10px' }}>
                      📋 Non-Technical Skills ({results.result.formatted_resume.skills_classified.non_technical.length}):
                    </h4>
                    <div className="keywords-grid">
                      {results.result.formatted_resume.skills_classified.non_technical.map((skill, idx) => (
                        <div key={idx} className="keyword-tag" style={{ background: '#f8f9fa', color: '#6c757d' }}>
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Fallback: Display skills if skills_classified is not available */}
            {(!results.result.formatted_resume.skills_classified || 
              (!results.result.formatted_resume.skills_classified.important && 
               !results.result.formatted_resume.skills_classified.less_important && 
               !results.result.formatted_resume.skills_classified.non_technical)) &&
             results.result.formatted_resume.skills && results.result.formatted_resume.skills.length > 0 && (
              <div className="resume-section">
                <h4>Skills:</h4>
                <div className="keywords-grid">
                  {results.result.formatted_resume.skills.map((skill, idx) => (
                    <div key={idx} className="keyword-tag">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.result.formatted_resume.experience && results.result.formatted_resume.experience.length > 0 && (
              <div className="resume-section">
                <h4>Experience:</h4>
                <ul>
                  {results.result.formatted_resume.experience.map((exp, idx) => (
                    <li key={idx}>
                      <strong>{exp.title || exp.position || ''}</strong> at {exp.company || ''} 
                      {exp.duration || exp.period ? ` (${exp.duration || exp.period})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.result.formatted_resume.education && results.result.formatted_resume.education.length > 0 && (
              <div className="resume-section">
                <h4>Education:</h4>
                <ul>
                  {results.result.formatted_resume.education.map((edu, idx) => (
                    <li key={idx}>
                      {edu.degree || ''} - {edu.institution || ''} {edu.year ? `(${edu.year})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(results.result.formatted_resume.summary || results.result.formatted_resume.objective) && (
              <div className="resume-section">
                <h4>Summary:</h4>
                <p>{results.result.formatted_resume.summary || results.result.formatted_resume.objective}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeTab;

