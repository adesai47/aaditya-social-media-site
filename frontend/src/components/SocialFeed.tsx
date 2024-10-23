import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa"; // Import heart icon from react-icons
import { useSpring, animated, useTrail } from "@react-spring/web";
import useMeasure from "react-use-measure";

const fast = { tension: 1200, friction: 40 };
const trans = (x: number, y: number) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`;

// SocialFeed component that contains the saved games with animation
export function SocialFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("http://localhost:3000/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts.");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );

      const response = await fetch(`http://localhost:3000/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like post.");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Social Feed</h1>

      {/* Posts container */}
      <div style={{ padding: "10px" }}>
        {posts.map((post) => (
          <MovableBlob key={post.id} post={post} handleLike={handleLike} />
        ))}
      </div>
    </div>
  );
}

// MovableBlob component with applied useTrail animation for each saved post
function MovableBlob({ post, handleLike }: { post: any; handleLike: (postId: number) => void }) {
  const [isActive, setIsActive] = useState(false); // Track if the blob is following the cursor
  const [ref, bounds] = useMeasure(); // Each blob has its own measure
  const [trail, api] = useTrail(3, () => ({
    xy: [bounds.width / 2, bounds.height / 2], // Start in the center
    config: fast,
  }));

  // Ensure position is updated correctly when bounds change
  useEffect(() => {
    if (bounds.width > 0 && bounds.height > 0) {
      api.start({ xy: [bounds.width / 2, bounds.height / 2] });
    }
  }, [bounds, api]);

  const handleBlobMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isActive) {
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      api.start({ xy: [x, y] });
    }
  };

  const toggleBlobActive = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent click events from affecting other blobs
    setIsActive((prevActive) => !prevActive); // Toggle the blob's active state
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        marginBottom: "20px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ color: "#333", marginBottom: "10px" }}>
        {post.user?.name || "Unknown User"}
      </h2>

      {/* Movable Blob with Trail Animation */}
      <div
        ref={ref}
        onMouseMove={handleBlobMouseMove}
        onClick={toggleBlobActive} // Toggle following on click
        style={{
          position: "relative",
          backgroundColor: post.artConfig.backgroundColor || "#252424",
          padding: "40px",
          borderRadius: "10px",
          marginBottom: "20px",
          overflow: "hidden",
          height: "300px", // Ensure a fixed height to contain the blob
          cursor: "pointer", // Indicate that it's clickable
        }}
      >
        {trail.map((props, index) => (
          <animated.div
            key={index}
            style={{
              position: "absolute",
              width: `${post.artConfig.blobSize}px`,
              height: `${post.artConfig.blobSize}px`,
              borderRadius: "50%",
              backgroundImage: post.artConfig.blobImage
                ? `url(${post.artConfig.blobImage})`
                : "none",
              backgroundColor: post.artConfig.blobImage
                ? "transparent" // Set background to transparent if an image is present
                : post.artConfig.blobColor, // Fallback to color if no image is present
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: props.xy.to(trans),
            }}
          />
        ))}
      </div>

      {/* Heart icon with a like counter */}
      <div
        onClick={() => handleLike(post.id)}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <FaHeart
          style={{
            color: "red",
            fontSize: "24px",
            marginRight: "8px",
          }}
        />
        <span>{isNaN(post.likes) ? 0 : post.likes}</span>
      </div>
    </div>
  );
}
