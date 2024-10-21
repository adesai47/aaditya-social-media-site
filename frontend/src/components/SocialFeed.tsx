import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

export const SocialFeed = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const likePost = async (postId: number) => {
    await fetch(`/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
  };

  return (
    <div>
      <h2>Social Feed</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>By: {post.user.username}</h3>
          <div>{/* Render artwork preview here */}</div>
          <button onClick={() => likePost(post.id)}>Like</button>
        </div>
      ))}
    </div>
  );
};
