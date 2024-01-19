import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";


export const dynamic = 'force-dynamic';

export async function GET() {
    const cards = await getCards();
    return NextResponse.json({cards});
}



async function getCards() {
    const cards = await prisma.card.findMany({
      orderBy: [
        {
          header: "asc"
        }
      ],
      select: {
        id: true,
        header: true,
        footer: true,
        updatedAt: true,
        list: true,
        type: true
      }
    });
    return cards;
  }