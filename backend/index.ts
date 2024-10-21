import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
app.use(bodyParser.json());

// User Signup
app.post('/signup', async (req: Request, res: Response) => {
  const { email, username } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        username,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'User could not be created' });
  }
});

// Create Post (Save Artwork)
app.post('/posts', async (req: Request, res: Response) => {
  const { userId, artwork } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        artwork,
        userId,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: 'Post could not be created' });
  }
});

// Fetch All Posts
app.get('/posts', async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true, likes: true },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Posts could not be retrieved' });
  }
});

// Like a Post
app.post('/posts/:id/like', async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  const { userId } = req.body;

  try {
    const like = await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    res.status(201).json(like);
  } catch (error) {
    res.status(400).json({ error: 'Like could not be added' });
  }
});

// Unlike a Post
app.delete('/posts/:id/like', async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  const { userId } = req.body;

  try {
    const like = await prisma.like.deleteMany({
      where: {
        postId,
        userId,
      },
    });
    res.json(like);
  } catch (error) {
    res.status(400).json({ error: 'Like could not be removed' });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
