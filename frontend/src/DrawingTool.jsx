import React, { useRef, useState, useEffect } from "react";
import './index.css';

export default function DrawingTool() {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pencil");
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [erasing, setErasing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const startDrawing = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPath([{ x, y }]);
  };

  const draw = (e) => {
    if (!currentPath.length) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPath = [...currentPath, { x, y }];
    setCurrentPath(newPath);
    redraw([...paths, newPath]);
  };

  const endDrawing = () => {
    if (currentPath.length > 0) {
      setPaths([...paths, currentPath]);
      setCurrentPath([]);
    }
  };

  const eraseStrokes = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPaths((prevPaths) => {
      const newPaths = prevPaths.filter(
        (path) => !path.some((point) => Math.hypot(point.x - x, point.y - y) < 15)
      );
      redraw(newPaths);
      return newPaths;
    });
  };

  const redraw = (allPaths) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";
    
    for (const path of allPaths) {
      ctx.beginPath();
      for (let i = 0; i < path.length; i++) {
        const { x, y } = path[i];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  const predictImage = async () => {
    if (paths.length === 0) {
      alert("Please draw something first!");
      return;
    }

    setIsLoading(true);
    const canvas = canvasRef.current;
    const imageBase64 = canvas.toDataURL("image/png");
  
    try {
      // const response = await fetch("https://your-api-endpoint.com/predict", {
      const response = await fetch("http://34.131.175.227:7001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageBase64 }),
      });
  
      const data = await response.json();
      console.log("Prediction result:", data);
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Prediction error:", error);
      setPrediction("Error: Could not analyze sketch");
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveImage = () => {
    if (paths.length === 0) {
      alert("Please draw something first!");
      return;
    }

    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "skribix-drawing.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const clearImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPaths([]);
    setPrediction(null);
  }

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (tool === "pencil") draw(e);
    else if (tool === "eraser" && erasing) eraseStrokes(e);
  };

  useEffect(() => {
    redraw(paths);
  }, []);

  return (
    <div className="drawing-app-container">
      <div className="tool-panel">
        <div className="drawing-tools">
          <button 
            className={`tool-button ${tool === "pencil" ? "active" : ""}`}
            onClick={() => setTool("pencil")}
          >
            <span className="tool-icon">✏️</span>
            <span className="tool-label">Pencil</span>
          </button>
          <button 
            className={`tool-button ${tool === "eraser" ? "active" : ""}`}
            onClick={() => setTool("eraser")}
          >
            <span className="tool-icon">🧽</span>
            <span className="tool-label">Eraser</span>  
          </button>
        </div>
        <div className="action-tools">
          <button 
            className="action-button save-button"
            onClick={saveImage}
          >
            <span className="button-icon">💾</span>
            <span className="button-label">Save</span>
          </button>
          <button 
            className="action-button predict-button"
            onClick={predictImage}
            disabled={isLoading || paths.length === 0}
          >
            <span className="button-icon">🔍</span>
            <span className="button-label">{isLoading ? "Analyzing..." : "Predict"}</span>
          </button>
          <button 
            className="action-button clear-button"
            onClick={clearImage}
          >
            <span className="button-icon">🗑️</span>
            <span className="button-label">Clear</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="canvas-container">
          <div className="canvas-wrapper">
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="drawing-canvas"
              onMouseDown={(e) => {
                if (tool === "pencil") startDrawing(e);
                else if (tool === "eraser") setErasing(true);
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={() => {
                if (tool === "pencil") endDrawing();
                else if (tool === "eraser") setErasing(false);
              }}
              onMouseLeave={() => {
                if (tool === "pencil") endDrawing();
                else if (tool === "eraser") setErasing(false);
              }}
            />

            {/* Custom Cursor */}
            <div
              className="custom-cursor"
              style={{
                left: mousePos.x,
                top: mousePos.y,
                display: mousePos.x === 0 && mousePos.y === 0 ? 'none' : 'block'
              }}
            >
              {tool === "pencil" && <span className="pencil-cursor">✏️</span>}
              {tool === "eraser" && !erasing && (
                <div className="eraser-cursor-idle" />
              )}
              {tool === "eraser" && erasing && (
                <div className="eraser-cursor-active" />
              )}
            </div>
          </div>
          <div className="drawing-instructions">
            Draw any simple object or shape for recognition
          </div>
        </div>

        <div className="prediction-container">
          <h2 className="prediction-title">AI Prediction</h2>
          <div className="prediction-content">
            {isLoading ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Analyzing your sketch...</p>
              </div>
            ) : prediction ? (
              <div className="prediction-result">
                <div className="prediction-badge">
                  <span className="prediction-label">I see a:</span>
                  <h3 className="prediction-text">{prediction}</h3>
                </div>
                <p className="prediction-hint">Draw something else or clear the canvas to try again!</p>
              </div>
            ) : (
              <div className="empty-prediction">
                <p className="prompt-message">Draw something and click "Predict" to see what the model recognizes!</p>
                <div className="example-icons">
                  <span>🚗</span>
                  <span>🏠</span>
                  <span>🌳</span>
                  <span>✈️</span>
                  <span>🐱</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}