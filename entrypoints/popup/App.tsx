import "./App.css";

function App() {
  const handleGetStarted = () => {
    // This would typically open the main extension or navigate to Google Docs
    window.open('https://docs.google.com', '_blank');
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <div className="popup-icon">
          <span className="icon-text">T</span>
        </div>
        <div className="popup-title-section">
          <h1 className="popup-title">Google Docs Text Replacer</h1>
          <p className="popup-version">v1.0.0</p>
        </div>
      </div>

      <div className="popup-content">
        <div className="feature-section">
          <h2 className="section-title">What does this extension do?</h2>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <div className="feature-text">
                <strong>Smart Text Selection</strong>
                <p>Select any text in Google Docs to see replacement options</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">✏️</div>
              <div className="feature-text">
                <strong>Quick Text Replacement</strong>
                <p>Replace selected text with custom content instantly</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">
                <strong>Real-time Preview</strong>
                <p>See your selected text before making changes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="how-to-section">
          <h2 className="section-title">How to use:</h2>
          <ol className="steps-list">
            <li>Open any Google Docs document</li>
            <li>Select the text you want to replace</li>
            <li>Use the floating panel to enter new text</li>
            <li>Click "Replace Text" to apply changes</li>
          </ol>
        </div>

        <div className="action-section">
          <button className="cta-button" onClick={handleGetStarted}>
            Get Started in Google Docs
          </button>
        </div>

        <div className="footer-section">
          <p className="footer-text">
            Make your Google Docs editing more efficient! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
