import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

export function ArtBuilder() {
  const [blobSize, setBlobSize] = useState(100);
  const [blobColor, setBlobColor] = useState("#61dafb");
  const [backgroundColor, setBackgroundColor] = useState("#252424");
  const [speed, setSpeed] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // New state for blob position

  // Blob animation with speed control and position
  const blobAnimation = useSpring({
    width: blobSize,
    height: blobSize,
    backgroundColor: blobColor,
    borderRadius: "50%",
    transform: `translate(${position.x}px, ${position.y}px)`, // Blob position based on cursor
    config: { duration: 1000 / speed },
  });

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX - blobSize / 2, y: e.clientY - blobSize / 2 });
  };

  const saveArtwork = async () => {
    const artworkConfig = {
      blobSize,
      blobColor,
      backgroundColor,
      speed,
    };

    try {
      setIsSaving(true);
      const response = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artConfig: artworkConfig, userId: "user-id" }),
      });

      if (!response.ok) {
        throw new Error("Failed to save artwork.");
      }

      alert("Artwork saved successfully.");
    } catch (error) {
      console.error("Error saving artwork:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto",
      }}
      onMouseMove={handleMouseMove} // Attach mouse move handler
    >
      <h1 style={{ color: "#333" }}>Art Editor</h1>

      {/* Controls for blob size, blob color, background color, and speed */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Blob Size: </label>
          <input
            type="range"
            min="50"
            max="300"
            value={blobSize}
            onChange={(e) => setBlobSize(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <span>{blobSize}px</span>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Blob Color: </label>
          <input
            type="color"
            value={blobColor}
            onChange={(e) => setBlobColor(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Background Color: </label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Speed: </label>
          <input
            type="range"
            min="1"
            max="5"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <span>{speed}</span>
        </div>
      </div>

      {/* Live Preview with Mouse Movement */}
      <div
        style={{
          margin: "20px auto",
          position: "relative",
          backgroundColor: backgroundColor,
          padding: "40px",
          borderRadius: "10px",
          width: "fit-content",
          height: "300px",
          overflow: "hidden",
        }}
      >
        <animated.div
          style={{
            ...blobAnimation,
            position: "absolute", // Absolute positioning for free movement
            cursor: "move",
          }}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={saveArtwork}
        style={{
          padding: "10px 20px",
          backgroundColor: isSaving ? "#ccc" : "#61dafb",
          border: "none",
          borderRadius: "5px",
          color: "#fff",
          cursor: isSaving ? "not-allowed" : "pointer",
        }}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Artwork"}
      </button>
    </div>
  );
}
