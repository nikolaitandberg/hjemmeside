import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all non-archived projects, ordered by 'order' then createdAt
export async function GET() {
  const projects = await prisma.project.findMany({
    where: { archived: false },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(projects);
}
// Bulk update order or archive status (PATCH)
export async function PATCH(request: NextRequest) {
  const data = await request.json();
  // data: { items: [{id, order, archived?}] }
  if (!Array.isArray(data.items))
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const updates = await Promise.all(
    data.items.map((item: { id: string; order?: number; archived?: boolean }) =>
      prisma.project.update({
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

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const { id, ...updateData } = data;
  const project = await prisma.project.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json(project);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const project = await prisma.project.create({ data });
  return NextResponse.json(project);
}
