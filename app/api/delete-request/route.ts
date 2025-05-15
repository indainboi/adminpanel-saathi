import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const requests = await prisma.deleteRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("❌ Error fetching delete requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch delete requests" },
      { status: 500 }
    );
  }
}
