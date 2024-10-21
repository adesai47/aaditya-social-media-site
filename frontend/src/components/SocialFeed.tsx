import React, { useEffect, useState } from "react";
import Avatar from "react-avataaars"; // Ensure this is correctly imported
import { useTrail, animated } from "@react-spring/web"; // Ensure this is correctly imported
import useMeasure from "react-use-measure"; // Ensure this is correctly imported

const fast = { tension: 1200, friction: 40 };
const slow = { mass: 10, tension: 200, friction: 50 };
const trans = (x: number, y: number) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`;

export function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [trail, api] = useTrail(3, (i) => ({
    xy: [0, 0],
    config: i === 0 ? fast : slow,
  }));
  const [ref, { left, top }] = useMeasure();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts");
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
      const response = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to like post.");
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    api.start({ xy: [e.clientX - left, e.clientY - top] });
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Social Feed</h1>

      {/* Gooey effect */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="30" />
          <feColorMatrix
            in="blur"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -7"
          />
        </filter>
      </svg>

      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        style={{
          position: "relative",
          width: "100%",
          height: "400px",
          marginBottom: "20px",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {trail.map((props, index) => (
          <animated.div
            key={index}
            style={{
              position: "absolute",
              width: "100px",
              height: "100px",
              backgroundColor: "#61dafb",
              borderRadius: "50%",
              filter: "url(#goo)",
              transform: props.xy.to(trans),
            }}
          />
        ))}
      </div>

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
            <Avatar {...post.artConfig} />
            <button
              onClick={() => handleLike(post.id)}
              style={{
                padding: "10px 15px",
                marginTop: "10px",
                backgroundColor: "#61dafb",
                border: "none",
                borderRadius: "5px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Like ({post.likes})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
