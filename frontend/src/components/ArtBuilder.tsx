import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

export function ArtBuilder() {
  // State for controlling the blob size, color, and dropdown options
  const [blobSize, setBlobSize] = useState(100);
  const [blobColor, setBlobColor] = useState("#61dafb");
  const [backgroundColor, setBackgroundColor] = useState("#252424");
  const [angle, setAngle] = useState(45);
  const [iterations, setIterations] = useState(3);
  const [animate, setAnimate] = useState(true);
  const [fillTriangles, setFillTriangles] = useState(true);
  const [fillSquares, setFillSquares] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state

  // React Spring animation for size and color
  const blobAnimation = useSpring({
    width: blobSize,
    height: blobSize,
    backgroundColor: blobColor,
    borderRadius: "50%",
  });

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const saveArtwork = async () => {
    const artworkConfig = {
      blobSize,
      blobColor,
      backgroundColor,
      angle,
      iterations,
      animate,
      fillTriangles,
      fillSquares,
    };

    try {
      const response = await fetch("/api/posts", {
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
    }
  };

  return (
    <div
      style={{
        position: "relative", // Ensure the parent container is relative to handle absolute positioning
        padding: "20px",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ color: "#333" }}>Art Editor</h1>

      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        style={{
          position: "absolute", // Absolute positioning within the container
          top: "10px", // Positioned at the top
          right: "10px", // Positioned at the right
          padding: "10px 20px",
          backgroundColor: "#61dafb",
          border: "none",
          borderRadius: "5px",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Options
      </button>

      {/* Options Dropdown */}
      {dropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "10px",
            backgroundColor: "#252424",
            padding: "20px",
            borderRadius: "10px",
            color: "#fff",
            zIndex: 1000, // Ensures it appears above other elements
            width: "250px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "10px" }}>Background: </label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "10px" }}>Angle: </label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <span>{angle}°</span>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Iterations: </label>
            <input
              type="number"
              min="1"
              max="10"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={animate}
                onChange={() => setAnimate(!animate)}
              />
              Animate
            </label>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={fillTriangles}
                onChange={() => setFillTriangles(!fillTriangles)}
              />
              Fill Triangles
            </label>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={fillSquares}
                onChange={() => setFillSquares(!fillSquares)}
              />
              Fill Squares
            </label>
          </div>
        </div>
      )}

      {/* Live Preview */}
      <div
        style={{
          margin: "20px auto",
          position: "relative",
          backgroundColor: backgroundColor,
          padding: "40px",
          borderRadius: "10px",
          width: "fit-content",
        }}
      >
        <animated.div style={{ ...blobAnimation, margin: "0 auto" }} />
      </div>

      {/* Save Button */}
      <button
        onClick={saveArtwork}
        style={{
          padding: "10px 20px",
          backgroundColor: "#61dafb",
          border: "none",
          borderRadius: "5px",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Save Artwork
      </button>
    </div>
  );
}
