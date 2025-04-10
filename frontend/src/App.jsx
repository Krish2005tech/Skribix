import DrawingTool from './DrawingTool';
import './index.css';

document.title = 'sKRIBIX';

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          {/* <span className="logo-text">Skribix</span> */}
          <span className="logo-text"><img src=".\public\skribixlogo.png" alt="Skribix" /></span>
          <span className="tagline">Hand-drawn Sketch Recognition Tool</span>
        </h1>
      </header>
      <main>
        <DrawingTool />
      </main>
      <footer className="app-footer">
        <p>© 2025 Skribix - Draw and identify sketches with machine learning</p>
      </footer>
    </div>
  );
}