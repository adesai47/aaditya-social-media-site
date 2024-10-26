import React, { useState, useEffect } from "react";
import { FaHeart, FaTrashAlt } from "react-icons/fa"; // Import heart and trash icons from react-icons
import { animated, useTrail } from "@react-spring/web";
import useMeasure from "react-use-measure";

const fast = { tension: 1200, friction: 40 };
const trans = (x: number, y: number) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`;

// Define the structure of a post
interface Post {
  id: number;
  user?: {
    name?: string;
  };
  userEmail?: string;
  likes: number;
  artConfig: {
    backgroundColor?: string;
    blobColor?: string;
    blobImage?: string;
    blobSize: number;
  };
}

export function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

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
    const isLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);
    if (isLiked) {
      newLikedPosts.delete(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );
      await unlikePost(postId); // Call the unlike API
    } else {
      newLikedPosts.add(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
      await likePost(postId); // Call the like API
    }
    setLikedPosts(newLikedPosts);
  };

  const likePost = async (postId: number) => {
    try {
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

  const unlikePost = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/unlike`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to unlike post.");
      }
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

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

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      alert("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div style={containerStyles}>
      <h1 style={titleStyles}>Blob Social Feed</h1>

      <div style={postsContainerStyles}>
        {posts.map((post) => (
          <MovableBlob
            key={post.id}
            post={post}
            handleLike={handleLike}
            handleDelete={handleDelete}
            isLiked={likedPosts.has(post.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MovableBlob({
  post,
  handleLike,
  handleDelete,
  isLiked,
}: {
  post: Post;
  handleLike: (postId: number) => void;
  handleDelete: (postId: number) => void;
  isLiked: boolean;
}) {
  const [isActive, setIsActive] = useState(false);
  const [ref, bounds] = useMeasure();
  const [trail, api] = useTrail(3, () => ({
    xy: [bounds.width / 2, bounds.height / 2],
    config: fast,
  }));

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
    e.stopPropagation();
    setIsActive((prevActive) => !prevActive);
  };

  return (
    <div style={postContainerStyles}>
      <h2 style={userNameStyles}>{post.user?.name || post.userEmail || "Unknown User"}</h2>

      <div
        ref={ref}
        onMouseMove={handleBlobMouseMove}
        onClick={toggleBlobActive}
        style={{
          position: "relative",
          backgroundColor: post.artConfig.backgroundColor || "#252424",
          padding: "40px",
          borderRadius: "10px",
          marginBottom: "20px",
          overflow: "hidden",
          height: "300px",
          cursor: "pointer",
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
              backgroundColor: post.artConfig.blobImage ? "transparent" : post.artConfig.blobColor,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: props.xy.to(trans),
            }}
          />
        ))}
      </div>

      <div style={actionContainerStyles}>
        <div onClick={() => handleLike(post.id)} style={likeButtonStyles}>
          <div style={{ marginRight: "8px" }}>
            <FaHeart color={isLiked ? "red" : "#888"} size={20} />
          </div>
          <span>{post.likes}</span>
        </div>

        <div onClick={() => handleDelete(post.id)} style={deleteButtonStyles}>
          <FaTrashAlt color="#888" size={20} />
        </div>
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
  width: "500px",
  margin: "20px auto",
  textAlign: "center",
};

const userNameStyles: React.CSSProperties = {
  color: "#333",
  marginBottom: "10px",
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
