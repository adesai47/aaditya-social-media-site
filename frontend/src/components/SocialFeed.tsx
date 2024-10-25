import React, { useState, useEffect } from "react";
import { FaHeart, FaTrashAlt } from "react-icons/fa"; // Import heart and trash icons from react-icons
import { useSpring, animated, useTrail } from "@react-spring/web";
import useMeasure from "react-use-measure";

const fast = { tension: 1200, friction: 40 };
const trans = (x: number, y: number) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`;

// SocialFeed component that contains the saved blob art posts with animation and delete functionality
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

  // Handle post deletion
  const handleDelete = async (postId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post.");
      }

      // Remove the deleted post from the state
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      alert("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <h1 style={titleStyles}>Blob Social Feed</h1>

      {/* Posts container */}
      <div style={{ padding: "10px" }}>
        {posts.map((post) => (
          <MovableBlob key={post.id} post={post} handleLike={handleLike} handleDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

// MovableBlob component with applied useTrail animation for each saved post
function MovableBlob({
  post,
  handleLike,
  handleDelete,
}: {
  post: any;
  handleLike: (postId: number) => void;
  handleDelete: (postId: number) => void;
}) {
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
    <div style={postContainerStyles}>
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

      {/* Like and Delete actions */}
      <div style={actionContainerStyles}>
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
              fontSize: "20px",
              marginRight: "8px",
            }}
          />
          <span>{isNaN(post.likes) ? 0 : post.likes}</span>
        </div>

        {/* Delete icon */}
        <FaTrashAlt
          onClick={() => handleDelete(post.id)}
          style={{
            color: "#888",
            fontSize: "20px",
            marginLeft: "15px",
            cursor: "pointer",
          }}
          title="Delete Post"
        />
      </div>
    </div>
  );
}

// Inline Styles
const titleStyles = {
  textAlign: "center",
  color: "#333",
  fontSize: "32px",  // Increased font size
  fontWeight: "bold",  // Bold text
  marginBottom: "20px", // Add spacing below the title
};

const postContainerStyles = {
  padding: "15px",  // Maintain good padding for content
  border: "1px solid #ddd",
  borderRadius: "10px",
  marginBottom: "30px",  // Maintain spacing between posts
  backgroundColor: "#fff",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",  // Slight shadow for elevation
  width: "500px",  // Increase width to make the post wider
  margin: "20px auto",  // Center the post and maintain vertical spacing
  textAlign: "center",
};



const actionContainerStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "10px", // Add some space between the image and the actions
};
