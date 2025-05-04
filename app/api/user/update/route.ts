import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId, messagesToAdd } = await req.json();

    if (!userId || typeof messagesToAdd !== "number") {
      return NextResponse.json({ error: 'Missing or invalid data' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        messagesLeft: {
          increment: messagesToAdd,
        },
      },
    });

    return NextResponse.json({
      message: `User upgraded with +${messagesToAdd} messages.`,
      user: updatedUser,
    });

  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json({ error: 'Failed to upgrade user' }, { status: 500 });
  }
}
