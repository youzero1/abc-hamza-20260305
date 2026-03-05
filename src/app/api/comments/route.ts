import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Comment } from '@/entities/Comment';
import { Post } from '@/entities/Post';
import { User } from '@/entities/User';

export async function GET(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const commentRepo = ds.getRepository(Comment);

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'postId query param is required' }, { status: 400 });
    }

    const comments = await commentRepo.find({
      where: { postId: Number(postId) },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    return NextResponse.json({ data: comments });
  } catch (error) {
    console.error('GET /api/comments error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const commentRepo = ds.getRepository(Comment);
    const postRepo = ds.getRepository(Post);
    const userRepo = ds.getRepository(User);

    const body = await request.json();
    const { content, postId, authorId } = body;

    if (!content || !postId) {
      return NextResponse.json({ error: 'content and postId are required' }, { status: 400 });
    }

    const post = await postRepo.findOne({ where: { id: Number(postId) } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let author: User | null = null;
    if (authorId) {
      author = await userRepo.findOne({ where: { id: Number(authorId) } });
    }

    const comment = commentRepo.create({
      content: String(content),
      post,
      postId: post.id,
      author: author || undefined,
      authorId: author?.id || null,
    });

    const saved = await commentRepo.save(comment);
    const fullComment = await commentRepo.findOne({
      where: { id: saved.id },
      relations: ['author'],
    });

    return NextResponse.json({ data: fullComment }, { status: 201 });
  } catch (error) {
    console.error('POST /api/comments error:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
