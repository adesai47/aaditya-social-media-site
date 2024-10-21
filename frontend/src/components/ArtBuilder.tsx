import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

export const ArtBuilder = () => {
  const { user } = useUser();
  const [artwork, setArtwork] = useState({});
  
  const handleSave = async () => {
    await fetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, artwork }),
    });
  };

  return (
    <div>
      <h2>Create Your Art</h2>
      <div>{/* Art creation tools, e.g., canvas, shapes, etc. */}</div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};
