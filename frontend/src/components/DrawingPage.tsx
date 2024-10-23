import React, { useRef, useState, useEffect } from "react";

export function DrawingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineColor, setLineColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  useEffect(() => {
    // Set the initial background color of the canvas when the component mounts
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [backgroundColor]); // Update the background color when it changes

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor; // Refill the canvas with the new background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawing = canvas.toDataURL("image/png");

    try {
      const response = await fetch("http://localhost:3000/api/drawings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drawing, userId: "user-id" }),
      });

      if (!response.ok) {
        throw new Error("Failed to save drawing.");
      }

      alert("Drawing saved successfully.");
    } catch (error) {
      console.error("Error saving drawing:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Drawing Art Page</h1>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{
          border: "1px solid black",
          cursor: "crosshair",
          backgroundColor: backgroundColor,
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div style={{ marginTop: "10px" }}>
        {/* Line Color Picker */}
        <label>Line Color: </label>
        <input
          type="color"
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
        />

        {/* Line Width Picker */}
        <label style={{ marginLeft: "10px" }}>Line Width: </label>
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
        />

        {/* Background Color Picker */}
        <label style={{ marginLeft: "10px" }}>Background Color: </label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        {/* Clear and Save Buttons */}
        <button onClick={clearCanvas} style={{ marginRight: "10px" }}>
          Clear
        </button>
        <button onClick={saveDrawing}>Save Drawing</button>
      </div>
    </div>
  );
}
