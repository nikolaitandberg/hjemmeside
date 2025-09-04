import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const timelineItems = await prisma.timelineItem.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(timelineItems);
}
