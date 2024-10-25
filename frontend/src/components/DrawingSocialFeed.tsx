import React, { useEffect, useState } from "react";
import { FaHeart, FaTrashAlt } from "react-icons/fa"; // Heart and Trash icons from react-icons

export function DrawingSocialFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("http://localhost:3000/api/drawings");
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

      const response = await fetch(`http://localhost:3000/api/drawings/${postId}/like`, {
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
      const response = await fetch(`http://localhost:3000/api/drawings/${postId}`, {
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
      <h1 style={titleStyles}>Drawing Social Feed</h1>

      {/* Posts container */}
      <div style={{ padding: "10px" }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={postContainerStyles}
          >
            <h2 style={{ color: "#333", marginBottom: "10px" }}>
              {post.user?.name || "Unknown User"}
            </h2>

            {/* Display the saved drawing */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <img
                src={post.drawing}
                alt="User Drawing"
                style={imageStyles}
              />
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
        ))}
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
  padding: "15px",  // Slightly increased padding for content
  border: "1px solid #ddd",
  borderRadius: "10px",
  marginBottom: "30px",  // Increased margin between posts for better spacing
  backgroundColor: "#fff",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",  // Added shadow for elevation effect
  width: "350px",  // Smaller width to resemble a social media post
  margin: "20px auto",  // Center the post on the page and add vertical spacing
  textAlign: "center",
};


const imageStyles = {
  maxWidth: "100%",   // Ensure the image fits within the post
  maxHeight: "300px",  // Set a max height for the image
  borderRadius: "6px", // Slightly round the corners of the image
  objectFit: "cover",  // Maintain aspect ratio, filling the container
};

const actionContainerStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "10px", // Add some space between the image and the actions
};
