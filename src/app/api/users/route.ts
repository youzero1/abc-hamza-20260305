import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { User } from '@/entities/User';

export async function GET(_request: NextRequest) {
  try {
    const ds = await getDataSource();
    const userRepo = ds.getRepository(User);

    const users = await userRepo.find({
      order: { createdAt: 'ASC' },
    });

    return NextResponse.json({ data: users });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const userRepo = ds.getRepository(User);

    const body = await request.json();
    const { username, email, bio, avatarUrl } = body;

    if (!username || !email) {
      return NextResponse.json({ error: 'username and email are required' }, { status: 400 });
    }

    // Check for existing user
    const existing = await userRepo.findOne({
      where: [{ username }, { email }],
    });
    if (existing) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 });
    }

    const user = userRepo.create({
      username: String(username),
      email: String(email),
      bio: bio ? String(bio) : null,
      avatarUrl: avatarUrl ? String(avatarUrl) : null,
    });

    const saved = await userRepo.save(user);
    return NextResponse.json({ data: saved }, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
