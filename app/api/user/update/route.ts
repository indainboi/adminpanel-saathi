import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from '@/lib/prisma';
import { allowedEmails } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  

  if (!session || !allowedEmails.includes(session.user?.email || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
        hasRecharged: true,
      },
    });

    console.log("✅ User updated:", updatedUser ); 

    return NextResponse.json({
      message: `User upgraded with +${messagesToAdd} messages.`,
      user: updatedUser,
    });

  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json({ error: 'Failed to upgrade user' }, { status: 500 });
  }
}
