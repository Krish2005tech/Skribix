import { useState, useEffect } from 'react';
import DrawingTool from './DrawingTool';
import DrawingToolMobile from './DrawingToolMobile';
import './index.css';

document.title = 'Skribix';

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to handle clicking on a sketch class in the About section
  const handleSketchClassClick = (className) => {
    setSelectedClass(className);
    setActiveTab('home'); // Switch to drawing tool
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          <span className="logo-text"><img src="./skribixlogo.png" alt="Skribix" /></span>
          <span className="tagline">Hand-drawn Sketch Recognition Tool</span>
        </h1>
      </header>
      
      <main>
        {activeTab === 'home' && (
          isMobile ? 
            <DrawingToolMobile initialClass={selectedClass} /> : 
            <DrawingTool initialClass={selectedClass} />
        )}
        
        {activeTab === 'about' && (
          <div className="about-container">
            <h2>About Skribix</h2>
            <p>Skribix is a machine learning powered sketch recognition tool that can identify hand-drawn sketches in real-time.</p>
            <p>Draw any of the supported objects, and our ML model will try to identify what you've drawn.</p>
            <h3>Supported Sketches</h3>
            <p className="click-instruction">Click on any class below to see a sample drawing</p>
            <div className="supported-sketches">
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Airplane")}><span>✈️</span> Airplane</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Book")}><span>📚</span> Book</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Cup")}><span>☕</span> Cup</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Envelope")}><span>✉️</span> Envelope</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Fan")}><span>🌀</span> Fan</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Fork")}><span>🍴</span> Fork</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Hat")}><span>👒</span> Hat</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Key")}><span>🔑</span> Key</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Laptop")}><span>💻</span> Laptop</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Leaf")}><span>🍃</span> Leaf</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Moon")}><span>🌙</span> Moon</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Pizza")}><span>🍕</span> Pizza</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("T-shirt")}><span>👕</span> T-shirt</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Traffic Light")}><span>🚦</span> Traffic Light</div>
              <div className="sketch-item clickable" onClick={() => handleSketchClassClick("Wine Glass")}><span>🍷</span> Wine Glass</div>
            </div>
          </div>
        )}
        

        
        {activeTab === 'docs' && (
          <div className="docs-container">
            <h2>Documentation</h2>
            <div className="doc-section">
              <h3>How to Use Skribix</h3>
              <ol>
                <li>Use the pencil tool to draw a sketch on the canvas</li>
                <li>Click the "Predict" button to have the ML Model identify your drawing</li>
                <li>Use the eraser tool to remove parts of your drawing</li>
                <li>Click "Clear" to start over</li>
                <li>Click "Save" to download your drawing as an image</li>
              </ol>
            </div>
            <div className="doc-section">
              <h3>Tips for Better Recognition</h3>
              <ul>
                <li>Draw in the center of the canvas</li>
                <li>Keep your drawings simple but distinctive</li>
                <li>Try to complete the shape's outline</li>
                <li>Draw only one object at a time</li>
              </ul>
            </div>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2025 Skribix - Draw and identify sketches with ML</p>
          <nav className="footer-nav">
            <button 
              className={`footer-nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </button>
            <button 
              className={`footer-nav-link ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button 
              className={`footer-nav-link ${activeTab === 'docs' ? 'active' : ''}`}
              onClick={() => setActiveTab('docs')}
            >
              How to Use
            </button>
            <a 
              href="https://github.com/Sahil-1918912/Skribix" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-nav-link"
            >
              GitHub
            </a>
            <a 
              href="https://skribix-project-page.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-nav-link"
            >
              Project Page
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}