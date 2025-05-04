import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  console.log("Received request for email:", email);

  if (!email) {
    try {
      const allUsers = await prisma.user.findMany();
      console.log('Fetched all users:', allUsers);
      return NextResponse.json({ users: allUsers });
    } catch (error) {
      console.error('Error fetching all users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User found:', user);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
