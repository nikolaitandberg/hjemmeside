import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const projects = await prisma.project.findMany();
  return NextResponse.json(projects);
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
