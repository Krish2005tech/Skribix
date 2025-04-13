import React, { useRef, useState, useEffect } from "react";
import './index.css';

export default function DrawingToolMobile() {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pencil");
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [erasing, setErasing] = useState(false);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Make canvas size responsive to the device width
  const canvas_size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.4);

  // Map of class labels to their corresponding emoji
  const labelToEmoji = {
    "Airplane": "✈️",
    "Book": "📚",
    "Cup": "☕",
    "Envelope": "✉️",
    "Fan": "🌀",
    "Fork": "🍴",
    "Hat": "👒",
    "Key": "🔑",
    "Laptop": "💻",
    "Leaf": "🍃",
    "Moon": "🌙",
    "Pizza": "🍕",
    "T-shirt": "👕",
    "Traffic Light": "🚦",
    "Wine Glass": "🍷"
  };

  // Sample emojis for the empty prediction state
  const exampleEmojis = ["✈️", "📚", "☕", "🍴", "🔑"];

  const startDrawing = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setCurrentPath([{ x, y }]);
  };

  const draw = (e) => {
    if (!currentPath.length) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const newPath = [...currentPath, { x, y }];
    setCurrentPath(newPath);
    redraw([...paths, newPath]);
    setTouchPos({ x, y });
  };

  const endDrawing = () => {
    if (currentPath.length > 0) {
      setPaths([...paths, currentPath]);
      setCurrentPath([]);
    }
  };

  const eraseStrokes = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setPaths((prevPaths) => {
      const newPaths = prevPaths.filter(
        (path) => !path.some((point) => Math.hypot(point.x - x, point.y - y) < 20)
      );
      redraw(newPaths);
      return newPaths;
    });
    setTouchPos({ x, y });
  };

  const redraw = (allPaths) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 4; // Slightly thicker for mobile
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

  const handleTouchMove = (e) => {
    if (tool === "pencil") draw(e);
    else if (tool === "eraser" && erasing) eraseStrokes(e);
  };

  useEffect(() => {
    redraw(paths);
  }, []);

  // Get emoji for predicted label if available
  const getPredictionEmoji = () => {
    if (!prediction || prediction.startsWith("Error")) return "";
    return labelToEmoji[prediction] || "";
  };

  return (
    <div className="drawing-app-container-mobile">
      <div className="canvas-container-mobile">
        <div className="canvas-wrapper-mobile">
          <canvas
            ref={canvasRef}
            width={canvas_size}
            height={canvas_size}
            className="drawing-canvas-mobile"
            onTouchStart={(e) => {
              if (tool === "pencil") startDrawing(e);
              else if (tool === "eraser") {
                setErasing(true);
                eraseStrokes(e);
              }
            }}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => {
              if (tool === "pencil") endDrawing();
              else if (tool === "eraser") setErasing(false);
            }}
            onTouchCancel={() => {
              if (tool === "pencil") endDrawing();
              else if (tool === "eraser") setErasing(false);
            }}
          />
        </div>
        <div className="drawing-instructions-mobile">
          Draw any simple object or shape
        </div>
      </div>

      <div className="tool-panel-mobile">
        <div className="drawing-tools-mobile">
          <button 
            className={`tool-button-mobile ${tool === "pencil" ? "active" : ""}`}
            onClick={() => setTool("pencil")}
          >
            <span className="tool-icon">✏️</span>
          </button>
          <button 
            className={`tool-button-mobile ${tool === "eraser" ? "active" : ""}`}
            onClick={() => setTool("eraser")}
          >
            <span className="tool-icon">🧽</span>
          </button>
        </div>
        <div className="action-tools-mobile">
          <button 
            className="action-button-mobile clear-button"
            onClick={clearImage}
          >
            <span className="button-icon">🗑️</span>
          </button>
          <button 
            className="action-button-mobile predict-button"
            onClick={predictImage}
            disabled={isLoading || paths.length === 0}
          >
            <span className="button-icon">{isLoading ? "⏳" : "🔍"}</span>
          </button>
          <button 
            className="action-button-mobile save-button"
            onClick={saveImage}
          >
            <span className="button-icon">💾</span>
          </button>
        </div>
      </div>

      <div className="prediction-container-mobile">
        <h2 className="prediction-title-mobile">Result</h2>
        <div className="prediction-content-mobile">
          {isLoading ? (
            <div className="loading-indicator-mobile">
              <div className="spinner-mobile"></div>
              <p>Analyzing...</p>
            </div>
          ) : prediction ? (
            <div className="prediction-result-mobile">
              <div className="prediction-badge-mobile">
                <h3 className="prediction-text-mobile">
                  {getPredictionEmoji()} {prediction}
                </h3>
              </div>
            </div>
          ) : (
            <div className="empty-prediction-mobile">
              <p className="prompt-message-mobile">Draw and tap 🔍</p>
              <div className="example-icons-mobile">
                {exampleEmojis.map((emoji, index) => (
                  <span key={index}>{emoji}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}