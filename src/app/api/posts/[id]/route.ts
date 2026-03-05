import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);

    const post = await postRepo.findOne({
      where: { id: Number(params.id) },
      relations: ['author', 'comments', 'comments.author'],
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);

    const post = await postRepo.findOne({ where: { id: Number(params.id) } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, published, likes } = body;

    if (title !== undefined) post.title = String(title);
    if (content !== undefined) post.content = String(content);
    if (excerpt !== undefined) post.excerpt = excerpt ? String(excerpt) : null;
    if (coverImage !== undefined) post.coverImage = coverImage ? String(coverImage) : null;
    if (published !== undefined) post.published = Boolean(published);
    if (likes !== undefined) post.likes = Number(likes);

    const saved = await postRepo.save(post);
    const fullPost = await postRepo.findOne({
      where: { id: saved.id },
      relations: ['author'],
    });

    return NextResponse.json({ data: fullPost });
  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);

    const post = await postRepo.findOne({ where: { id: Number(params.id) } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await postRepo.remove(post);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
