import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { parseJsonArray, toJsonArray } from "@/utils/jsonArray";

export async function POST(req: NextRequest) {
  const { tags, ...data } = await req.json();
  const timelineItem = await prisma.timelineItem.create({
    data: { ...data, tags: toJsonArray(tags ?? []) },
  });
  return NextResponse.json({ ...timelineItem, tags: parseJsonArray(timelineItem.tags) });
}
