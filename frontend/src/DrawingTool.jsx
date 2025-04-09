import React, { useRef, useState, useEffect } from "react";
import './index.css';

export default function DrawingTool() {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pencil");
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [erasing, setErasing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
        (path) => !path.some((point) => Math.hypot(point.x - x, point.y - y) < 10)
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
    ctx.lineWidth = 2;
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
    const canvas = canvasRef.current;
    const imageBase64 = canvas.toDataURL("image/png");
  
    try {
      // const response = await fetch("https://your-api-endpoint.com/predict", {
      const response = await fetch("http://localhost:7001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageBase64 }),
      });
  
      const data = await response.json();
      console.log("Prediction result:", data);
      alert(data.prediction);
      // Optionally: alert(data.prediction); or set to state
    } catch (error) {
      console.error("Prediction error:", error);
    }
  
  };
  

  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "drawing.png";
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
    <div className="drawing-container">
      <div
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <canvas
          ref={canvasRef}
          width={window.innerHeight * 0.7}
          height={window.innerHeight * 0.7}
          style={{
            border: "5px solid black",
            background: "white",
            cursor: "none",
            borderRadius: "20px",
          }}
          onMouseDown={(e) => {
            if (tool === "pencil") startDrawing(e);
            else if (tool === "eraser") setErasing(true);
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={() => {
            if (tool === "pencil") endDrawing();
            else if (tool === "eraser") setErasing(false);
          }}
        />

        {/* Custom Cursor — positioned relative to the canvas */}
        <div
          style={{
            position: "absolute",
            left: mousePos.x,
            top: mousePos.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {tool === "pencil" && <span style={{ fontSize: 20,
            transform: "translate(-50%, -50%)" 
           }}>✏️</span>}
          {tool === "eraser" && !erasing && (
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid black",
                backgroundColor: "transparent",
              }}
            />
          )}
          {tool === "eraser" && erasing && (
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "gray",
              }}
            />
          )}
        </div>
      </div>

      <div className="tool-buttons" style={{ marginTop: 20 }}>
        <button onClick={() => setTool("pencil")}>Pencil</button>
        <button onClick={() => setTool("eraser")}>Eraser</button>
        <button onClick={saveImage}>Save as PNG</button>
        <button onClick={predictImage}>Predict</button>
        <button onClick={clearImage}>Clear</button>

      </div>
    </div>
  );
}
