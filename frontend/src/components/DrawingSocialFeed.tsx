import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa"; // Heart icon from react-icons

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

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Drawing Social Feed</h1>

      {/* Posts container */}
      <div style={{ padding: "10px" }}>
        {posts.map((post) => (
          <div
            key={post.id}
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

            {/* Display the saved drawing */}
            <img
              src={post.drawing}
              alt="User Drawing"
              style={{ width: "500px", height: "500px", borderRadius: "10px" }}
            />

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
        ))}
      </div>
    </div>
  );
}
