import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const timelineItem = await prisma.timelineItem.create({ data });
  return NextResponse.json(timelineItem);
}
