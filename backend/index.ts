import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

// Initialize Prisma Client
const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing for all routes

// API Routes

// Create a new post (artwork)
app.post("http://localhost:3000/api/posts", async (req, res) => {
  const { userId, artConfig } = req.body;

  if (!userId || !artConfig) {
    return res.status(400).json({ error: "Invalid request: missing userId or artConfig" });
  }

  try {
    const post = await prisma.post.create({
      data: {
        userId,
        artConfig,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Fetch all posts (artworks)
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post("/api/posts", async (req, res) => {
  const { userId, artConfig } = req.body;

  if (!userId || !artConfig) {
    return res.status(400).json({ error: "Invalid request: missing userId or artConfig" });
  }

  try {
    const post = await prisma.post.create({
      data: {
        userId,
        artConfig,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});


// Fetch a single post by ID
app.get("/api/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Update a post (artwork) by ID
app.put("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { artConfig } = req.body;

  if (!artConfig) {
    return res.status(400).json({ error: "Invalid request: missing artConfig" });
  }

  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        artConfig,
      },
    });

    res.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// Delete a post by ID
app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

app.post("/api/posts/:id/like", async (req, res) => {
  const postId = parseInt(req.params.id);

  if (isNaN(postId)) {
    console.error("Invalid post ID");
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      console.error("Post not found");
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error); // Log the actual error
    res.status(500).json({ error: "Failed to like post" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
