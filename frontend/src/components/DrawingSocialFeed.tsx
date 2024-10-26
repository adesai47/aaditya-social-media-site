import { useEffect, useState } from "react";
import { FaHeart, FaTrashAlt } from "react-icons/fa";

// Define the structure of a post
interface Post {
  id: number;
  user?: {
    name?: string;
  };
  likes: number;
  drawing: string;
}

export function DrawingSocialFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("http://localhost:3000/api/drawings");
        if (!response.ok) {
          throw new Error("Failed to fetch posts.");
        }
        const data: Post[] = await response.json();
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

      <div style={postsContainerStyles}>
        {posts.map((post) => (
          <div key={post.id} style={postContainerStyles}>
            <h2 style={userNameStyles}>{post.user?.name || "Unknown User"}</h2>

            <div style={drawingContainerStyles}>
              <img src={post.drawing} alt="User Drawing" style={imageStyles} />
            </div>

            <div style={actionContainerStyles}>
              <div onClick={() => handleLike(post.id)} style={likeButtonStyles}>
                <div style={{ marginRight: "8px" }}>
                  <FaHeart color="red" size={20} />
                </div>
                <span>{isNaN(post.likes) ? 0 : post.likes}</span>
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

// Inline Styles
const containerStyles: React.CSSProperties = {
  padding: "20px",
  backgroundColor: "#f5f5f5",
};

const titleStyles: React.CSSProperties = {
  textAlign: "center",
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const postsContainerStyles: React.CSSProperties = {
  padding: "10px",
};

const postContainerStyles: React.CSSProperties = {
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  marginBottom: "30px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  width: "350px",
  margin: "20px auto",
  textAlign: "center",
};

const userNameStyles: React.CSSProperties = {
  color: "#333",
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
};

const deleteButtonStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  marginLeft: "15px",
};
