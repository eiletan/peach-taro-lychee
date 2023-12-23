import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";


export async function GET() {
    const lists = await getLists();
    return NextResponse.json({lists});
}



async function getLists() {
    const lists = await prisma.list.findMany({
        select: {
          id: true,
          ownerId: true,
          listItems: true
        }
      });
      return lists;
  }