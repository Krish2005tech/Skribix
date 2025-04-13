import React, { useRef, useState, useEffect } from "react";
import './index.css';


// Import sample images (add at top of file)
import AirplaneImg from './assets/Airplane.png';
import BookImg from './assets/Book.png';
import CupImg from './assets/Cup.png';
import EnvelopeImg from './assets/Envelope.png';
import FanImg from './assets/Fan.png';
import ForkImg from './assets/Fork.png';
import HatImg from './assets/Hat.png';
import KeyImg from './assets/Key.png';
import LaptopImg from './assets/Laptop.png';
import LeafImg from './assets/Leaf.png';
import MoonImg from './assets/Moon.png';
import PizzaImg from './assets/Pizza.png';
import TshirtImg from './assets/T-shirt.png';
import TrafficLightImg from './assets/Traffic Light.png';
import WineGlassImg from './assets/Wine Glass.png';

export default function DrawingTool({ initialClass = null }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pencil");
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [erasing, setErasing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sampleImage, setSampleImage] = useState(false);
  const [sampleImageClass, setSampleImageClass] = useState(null);

  const canvas_size = window.innerHeight * 0.5;

   // Sample images mapping
   const sampleImages = {
    "Airplane": AirplaneImg,
    "Book": BookImg,
    "Cup": CupImg,
    "Envelope": EnvelopeImg,
    "Fan": FanImg,
    "Fork": ForkImg,
    "Hat": HatImg,
    "Key": KeyImg,
    "Laptop": LaptopImg,
    "Leaf": LeafImg,
    "Moon": MoonImg,
    "Pizza": PizzaImg,
    "T-shirt": TshirtImg,
    "Traffic Light": TrafficLightImg,
    "Wine Glass": WineGlassImg
  };

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
  const exampleEmojis = ["✈️", "📚", "☕", "✉️", "🌀", "🍴", "👒", "🔑"];

  const emojiToLabel = Object.entries(labelToEmoji).reduce((acc, [label, emoji]) => {
    acc[emoji] = label;
    return acc;
  }, {});

  
  // Updated function to load sample image without setting prediction
  const loadSampleImage = (className) => {
    if (!sampleImages[className]) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Clear the canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Load and draw the sample image
    const img = new Image();
    img.onload = () => {
      // Center the image on the canvas
      const scale = Math.min(
        (canvas.width * 0.8) / img.width,
        (canvas.height * 0.8) / img.height
      );
      
      const centerX = (canvas.width - img.width * scale) / 2;
      const centerY = (canvas.height - img.height * scale) / 2;
      
      ctx.drawImage(img, centerX, centerY, img.width * scale, img.height * scale);
      
      // Clear existing paths since we're directly drawing the image
      setPaths([]);
      
      // Set sample image flag but don't set prediction
      setSampleImage(true);
      setSampleImageClass(className);
      
      // Reset prediction when loading a new sample
      setPrediction(null);
    };
    
    img.src = sampleImages[className];
  };

  const handleEmojiClick = (emoji) => {
    const className = emojiToLabel[emoji];
    if (className) {
      loadSampleImage(className);
    }
  };

  // Handle class name click in the about section
  const handleClassNameClick = (className) => {
    loadSampleImage(className);
  };

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
    
    // Don't clear if we have a sample image and no paths yet
    // This preserves the sample image when we start drawing
    if (!(sampleImage && allPaths.length === 0)) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // If we cleared and had a sample image, redraw it
      if (sampleImage) {
        // Get the class name from the emoji to label mapping
        let className = null;
        for (const [label, emoji] of Object.entries(labelToEmoji)) {
          if (sampleImages[label]) {
            className = label;
            break;
          }
        }
        
        if (className) {
          const img = new Image();
          img.onload = () => {
            const scale = Math.min(
              (canvas.width * 0.8) / img.width,
              (canvas.height * 0.8) / img.height
            );
            
            const centerX = (canvas.width - img.width * scale) / 2;
            const centerY = (canvas.height - img.height * scale) / 2;
            
            ctx.drawImage(img, centerX, centerY, img.width * scale, img.height * scale);
            
            // Draw paths on top of the image
            drawPaths(ctx, allPaths);
          };
          
          // Find the correct sample image
          for (const [imgLabel, imgSrc] of Object.entries(sampleImages)) {
            if (imgLabel === className) {
              img.src = imgSrc;
              break;
            }
          }
          
          return; // Exit early as the onload will handle drawing paths
        }
      }
    }
    
    // Draw all paths
    drawPaths(ctx, allPaths);
  };
  
  // Helper function to draw paths
  const drawPaths = (ctx, allPaths) => {
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
    if (paths.length === 0 && !sampleImageClass) {
      alert("Please draw something first!");
      return;
    }
  
    setIsLoading(true);
    
    // Force a redraw right before capturing
    if (sampleImageClass && sampleImages[sampleImageClass]) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      // Clear and redraw everything from scratch
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the sample image
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(
          (canvas.width * 0.8) / img.width,
          (canvas.height * 0.8) / img.height
        );
        
        const centerX = (canvas.width - img.width * scale) / 2;
        const centerY = (canvas.height - img.height * scale) / 2;
        
        ctx.drawImage(img, centerX, centerY, img.width * scale, img.height * scale);
        
        // Draw paths on top
        drawPaths(ctx, paths);
        
        // Now capture and send
        const imageBase64 = canvas.toDataURL("image/png");
        sendPredictionRequest(imageBase64);
      };
      
      img.src = sampleImages[sampleImageClass];
    } else {
      // No sample image, just capture current canvas
      const canvas = canvasRef.current;
      const imageBase64 = canvas.toDataURL("image/png");
      sendPredictionRequest(imageBase64);
    }
    
    function sendPredictionRequest(imageBase64) {
      fetch("http://34.131.175.227:7001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageBase64 }),
      })
      .then(response => response.json())
      .then(data => {
        console.log("Prediction result:", data);
        setPrediction(data.prediction);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Prediction error:", error);
        setPrediction("Error: Could not analyze sketch");
        setIsLoading(false);
      });
    }
  };
  
  const saveImage = () => {
    // Allow saving sample image
    if (paths.length === 0 && !sampleImage) {
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
    setSampleImage(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPaths([]);
    setPrediction(null);
    setSampleImageClass(null);
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

  useEffect(() => {
    if (initialClass && sampleImages[initialClass]) {
      loadSampleImage(initialClass);
    }
  }, [initialClass]);

  // Get emoji for predicted label if available
  const getPredictionEmoji = () => {
    if (!prediction || prediction.startsWith("Error")) return "";
    return labelToEmoji[prediction] || "";
  };

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
            disabled={paths.length === 0 && !sampleImage}
          >
            <span className="button-icon">💾</span>
            <span className="button-label">Save</span>
          </button>
          <button 
            className="action-button predict-button"
            onClick={predictImage}
            disabled={isLoading || (paths.length === 0 && !sampleImage)}
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
              width={canvas_size}
              height={canvas_size}
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
              {tool === "pencil" && <span className="pencil-cursor">⊹</span>}
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
          <h2 className="prediction-title">Model Prediction</h2>
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
                  <h3 className="prediction-text">
                    <span 
                      className="clickable-emoji" 
                      onClick={() => handleEmojiClick(getPredictionEmoji())}
                      title="Click to see a sample"
                    >
                      {getPredictionEmoji()}
                    </span> {prediction}
                  </h3>
                </div>
                <p className="prediction-hint">Draw something else or clear the canvas to try again!</p>
              </div>
            ) : (
              <div className="empty-prediction">
                <p className="prompt-message">Draw something and click "Predict" to see what the model recognizes!</p>
                <div className="example-icons">
                  {exampleEmojis.map((emoji, index) => (
                    <span 
                      key={index} 
                      className="clickable-emoji"
                      onClick={() => handleEmojiClick(emoji)}
                      title="Click to see a sample"
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
                <p className="sample-hint">Click any emoji to see a sample drawing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}