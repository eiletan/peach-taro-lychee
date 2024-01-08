import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";


export async function GET() {
    const cards = await getCards();
    return NextResponse.json({cards});
}



async function getCards() {
    const cards = await prisma.card.findMany({
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