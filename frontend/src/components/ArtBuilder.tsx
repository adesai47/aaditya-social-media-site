import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

export function ArtBuilder() {
  const [blobSize, setBlobSize] = useState(100);
  const [blobColor, setBlobColor] = useState("#61dafb");
  const [backgroundColor, setBackgroundColor] = useState("#252424");
  const [speed, setSpeed] = useState(1);
  const [blobImage, setBlobImage] = useState(""); // Manage selected image

  const predefinedImages = [
    { name: "Soccer Ball", src: "/images/soccer-ball.png" },
    { name: "Emoji Smiley", src: "/images/smiley.png" },
    { name: "Emoji Heart", src: "/images/heart-emoji.png" },
  ];

  const blobAnimation = useSpring({
    width: blobSize,
    height: blobSize,
    backgroundColor: blobColor,
    borderRadius: "50%",
    config: { duration: speed * 1000 }, // Speed affects the animation duration
  });

  const saveArtwork = async () => {
    const artworkConfig = {
      blobSize,
      blobImage,
      blobColor,
      backgroundColor,
      speed,
    };

    try {
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
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ color: "#333", fontSize: "28px", fontWeight: "bold" }}>Art Editor</h1>

      {/* Options */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-around",
          gap: "20px",
        }}
      >
        {/* Background Color */}
        <div>
          <label style={{ marginRight: "10px" }}>Background Color: </label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>

        {/* Blob Color */}
        <div>
          <label style={{ marginRight: "10px" }}>Blob Color: </label>
          <input
            type="color"
            value={blobColor}
            onChange={(e) => setBlobColor(e.target.value)}
            disabled={!!blobImage} // Disable if an image is selected
          />
        </div>

        {/* Blob Size */}
        <div>
          <label style={{ marginRight: "10px" }}>Blob Size: </label>
          <input
            type="range"
            min="50"
            max="300"
            value={blobSize}
            onChange={(e) => setBlobSize(Number(e.target.value))}
          />
        </div>

        {/* Speed */}
        <div>
          <label style={{ marginRight: "10px" }}>Blob Speed: </label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Blob Image Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Select Blob Image: </label>
        <select onChange={(e) => setBlobImage(e.target.value)} value={blobImage}>
          <option value="">None</option>
          {predefinedImages.map((img) => (
            <option key={img.src} value={img.src}>
              {img.name}
            </option>
          ))}
        </select>
      </div>

      {/* Blob Preview */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "300px", // Fixed square container for the blob
          height: "300px", // Fixed square container for the blob
          backgroundColor: backgroundColor,
          margin: "0 auto",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <animated.div
          style={{
            ...blobAnimation,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Center the blob in the square
            backgroundImage: blobImage ? `url(${blobImage})` : "",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: blobImage ? "" : blobColor, // Use color if no image selected
          }}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={saveArtwork}
        style={{
          padding: "10px 20px",
          backgroundColor: "#61dafb",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          cursor: "pointer",
          marginTop: "20px",
          transition: "background-color 0.3s ease",
        }}
      >
        Save Artwork
      </button>
    </div>
  );
}
