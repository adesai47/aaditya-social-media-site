import React, { useEffect, useState } from "react";
import { FaHeart, FaTrashAlt } from "react-icons/fa"; // Heart and Trash icons from react-icons

// Define the structure of a post
interface DrawingPost {
  id: number;
  user?: {
    name?: string;
  };
  userEmail?: string;
  likes: number;
  drawing: string;
}

export function DrawingSocialFeed() {
  const [posts, setPosts] = useState<DrawingPost[]>([]); // Set posts state with type DrawingPost[]

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("http://localhost:3000/api/drawings");
        if (!response.ok) {
          throw new Error("Failed to fetch posts.");
        }
        const data: DrawingPost[] = await response.json();
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

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      alert("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div style={containerStyles}>
      <h1 style={titleStyles}>Drawing Social Feed</h1>

      {/* Posts container */}
      <div style={postsContainerStyles}>
        {posts.map((post) => (
          <div key={post.id} style={postContainerStyles}>
            <h2 style={userNameStyles}>{post.user?.name || post.userEmail || "Unknown User"}</h2>

            {/* Display the saved drawing */}
            <div style={drawingContainerStyles}>
              <img src={post.drawing} alt="User Drawing" style={imageStyles} />
            </div>

            {/* Like and Delete actions */}
            <div style={actionContainerStyles}>
              <div onClick={() => handleLike(post.id)} style={likeButtonStyles}>
                <FaHeart color="#61dafb" size={20} style={{ marginRight: "8px" }} />
                <span>{post.likes}</span>
              </div>

              <div onClick={() => handleDelete(post.id)} style={deleteButtonStyles}>
                <FaTrashAlt color="#888" size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Inline Styles with primary colors black and blue
const containerStyles: React.CSSProperties = {
  padding: "20px",
  backgroundColor: "#000",
  color: "#61dafb",
};

const titleStyles: React.CSSProperties = {
  textAlign: "center",
  color: "#61dafb",
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const postsContainerStyles: React.CSSProperties = {
  padding: "10px",
};

const postContainerStyles: React.CSSProperties = {
  padding: "15px",
  border: "1px solid #61dafb",
  borderRadius: "10px",
  marginBottom: "30px",
  backgroundColor: "#111",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
  width: "500px",
  margin: "20px auto",
  textAlign: "center",
};

const userNameStyles: React.CSSProperties = {
  color: "#61dafb",
  marginBottom: "10px",
};

const drawingContainerStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "10px",
};

const imageStyles: React.CSSProperties = {
  maxWidth: "100%",
  maxHeight: "300px",
  borderRadius: "6px",
  objectFit: "cover",
};

const actionContainerStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "10px",
};

const likeButtonStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  color: "#61dafb",
};

const deleteButtonStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  marginLeft: "15px",
  color: "#888",
};
