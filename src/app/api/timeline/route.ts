import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const timelineItems = await prisma.timelineItem.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(timelineItems);
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const { id, ...updateData } = data;
  const item = await prisma.timelineItem.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json(item);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.timelineItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const timelineItem = await prisma.timelineItem.create({ data });
  return NextResponse.json(timelineItem);
}
