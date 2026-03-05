import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '@/entities/User';
import { Post } from '@/entities/Post';
import { Comment } from '@/entities/Comment';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.resolve('./data/abc.sqlite');

// Ensure data directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: dbPath,
  synchronize: true,
  logging: false,
  entities: [User, Post, Comment],
});

let initialized = false;
let initPromise: Promise<DataSource> | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (initialized && AppDataSource.isInitialized) {
    return AppDataSource;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = AppDataSource.initialize()
    .then(async (ds) => {
      initialized = true;
      await seedDatabase(ds);
      return ds;
    })
    .catch((err) => {
      initPromise = null;
      throw err;
    });

  return initPromise;
}

async function seedDatabase(ds: DataSource): Promise<void> {
  const userRepo = ds.getRepository(User);
  const postRepo = ds.getRepository(Post);

  const existingUser = await userRepo.findOne({ where: {} });
  if (!existingUser) {
    const defaultUser = userRepo.create({
      username: 'admin',
      email: 'admin@abc.com',
      bio: 'Welcome to abc blog! I am the default admin user.',
      avatarUrl: null,
    });
    const savedUser = await userRepo.save(defaultUser);

    const samplePost = postRepo.create({
      title: 'Welcome to abc Blog!',
      content: `# Welcome to abc!\n\nThis is your first blog post. abc is a modern social blogging platform where you can share your thoughts, ideas, and stories with the world.\n\n## Getting Started\n\n- Create new posts using the **Create Post** button in the navbar\n- Browse all posts in the **All Posts** section\n- Interact with the community by leaving comments\n- Like posts you enjoy\n\n## Features\n\n- **Rich Content**: Write detailed posts with full content support\n- **Comments**: Engage with readers through the comment section\n- **Likes**: Show appreciation for great content\n- **Profiles**: Build your author profile\n\nHappy blogging!`,
      excerpt: 'Welcome to abc, your new favorite blogging platform. Get started by exploring posts and creating your own!',
      published: true,
      likes: 5,
      author: savedUser,
      authorId: savedUser.id,
    });
    await postRepo.save(samplePost);

    const post2 = postRepo.create({
      title: 'Getting the Most Out of abc',
      content: `# Tips for Using abc\n\nHere are some tips to help you make the most of your abc blogging experience.\n\n## Writing Great Posts\n\nA great blog post starts with a compelling title and a clear excerpt that draws readers in. Make sure your content is well-structured and easy to read.\n\n## Engaging with the Community\n\nDon't forget to comment on posts you find interesting. Engagement is what makes a blogging community thrive!\n\n## Building Your Profile\n\nFill out your profile bio to let readers know who you are and what you write about. A complete profile builds trust and encourages more readers to follow your work.`,
      excerpt: 'Discover tips and tricks to get the most out of your abc blogging experience.',
      published: true,
      likes: 3,
      author: savedUser,
      authorId: savedUser.id,
    });
    await postRepo.save(post2);
  }
}

export default AppDataSource;
