import { useState, useEffect } from 'react';
import DrawingTool from './DrawingTool';
import DrawingToolMobile from './DrawingToolMobile';
import './index.css';

document.title = 'sKRIBIX';

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          <span className="logo-text"><img src="./skribixlogo.png" alt="Skribix" /></span>
          {/* <span className="tagline">{isMobile ? 'Sketch Recognition' : 'Hand-drawn Sketch Recognition Tool'}</span> */}
          <span className="tagline">'Hand-drawn Sketch Recognition Tool'</span>
        </h1>
      </header>
      <main>
        {isMobile ? <DrawingToolMobile /> : <DrawingTool />}
      </main>
      <footer className="app-footer">
        <p>© 2025 Skribix - Draw and identify sketches with ML</p>
      </footer>
    </div>
  );
}