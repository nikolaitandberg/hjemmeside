import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { parseJsonArray, toJsonArray } from "@/utils/jsonArray";

// Get all non-archived timeline items, ordered by 'order' then date
export async function GET() {
  const timelineItems = await prisma.timelineItem.findMany({
    where: { archived: false },
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });
  return NextResponse.json(
    timelineItems.map((t) => ({ ...t, tags: parseJsonArray(t.tags) })),
  );
}

// Update a timeline item (PUT)
export async function PUT(request: NextRequest) {
  const data = await request.json();
  const { id, tags, ...updateData } = data;
  const item = await prisma.timelineItem.update({
    where: { id },
    data: {
      ...updateData,
      ...(tags !== undefined ? { tags: toJsonArray(tags) } : {}),
    },
  });
  return NextResponse.json({ ...item, tags: parseJsonArray(item.tags) });
}

// Bulk update order or archive status (PATCH)
export async function PATCH(request: NextRequest) {
  const data = await request.json();
  // data: { items: [{id, order, archived?}] }
  if (!Array.isArray(data.items))
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const updates = await Promise.all(
    data.items.map((item: { id: string; order?: number; archived?: boolean }) =>
      prisma.timelineItem.update({
        where: { id: item.id },
        data: {
          ...(item.order !== undefined ? { order: item.order } : {}),
          ...(item.archived !== undefined ? { archived: item.archived } : {}),
        },
      }),
    ),
  );
  return NextResponse.json({ success: true, updates });
}

// Delete a timeline item
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.timelineItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

// Create a timeline item
export async function POST(request: NextRequest) {
  const { tags, ...data } = await request.json();
  const timelineItem = await prisma.timelineItem.create({
    data: { ...data, tags: toJsonArray(tags ?? []) },
  });
  return NextResponse.json({ ...timelineItem, tags: parseJsonArray(timelineItem.tags) });
}
