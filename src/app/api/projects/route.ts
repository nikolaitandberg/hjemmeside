import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import { parseJsonArray, toJsonArray } from "@/utils/jsonArray";

// Get all non-archived projects, ordered by 'order' then createdAt
export async function GET() {
  const projects = await prisma.project.findMany({
    where: { archived: false },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(
    projects.map((p) => ({
      ...p,
      technologies: parseJsonArray(p.technologies),
    })),
  );
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
  const { id, technologies, ...updateData } = data;
  const project = await prisma.project.update({
    where: { id },
    data: {
      ...updateData,
      ...(technologies !== undefined
        ? { technologies: toJsonArray(technologies) }
        : {}),
    },
  });
  return NextResponse.json({
    ...project,
    technologies: parseJsonArray(project.technologies),
  });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  const { technologies, ...data } = await request.json();
  const project = await prisma.project.create({
    data: { ...data, technologies: toJsonArray(technologies ?? []) },
  });
  return NextResponse.json({
    ...project,
    technologies: parseJsonArray(project.technologies),
  });
}
