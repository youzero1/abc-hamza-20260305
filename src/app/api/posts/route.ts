import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';
import { User } from '@/entities/User';
import { ILike } from 'typeorm';

export async function GET(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '9', 10)));
    const skip = (page - 1) * limit;

    const queryBuilder = postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.published = :published', { published: true });

    if (search) {
      queryBuilder.andWhere(
        '(post.title LIKE :search OR post.content LIKE :search OR post.excerpt LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [posts, total] = await queryBuilder
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return NextResponse.json({
      data: posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const postRepo = ds.getRepository(Post);
    const userRepo = ds.getRepository(User);

    const body = await request.json();
    const { title, content, excerpt, coverImage, published, authorId } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    let author: User | null = null;
    if (authorId) {
      author = await userRepo.findOne({ where: { id: Number(authorId) } });
    }

    const post = postRepo.create({
      title: String(title),
      content: String(content),
      excerpt: excerpt ? String(excerpt) : null,
      coverImage: coverImage ? String(coverImage) : null,
      published: Boolean(published),
      likes: 0,
      author: author || undefined,
      authorId: author?.id || null,
    });

    const saved = await postRepo.save(post);
    const fullPost = await postRepo.findOne({
      where: { id: saved.id },
      relations: ['author'],
    });

    return NextResponse.json({ data: fullPost }, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
