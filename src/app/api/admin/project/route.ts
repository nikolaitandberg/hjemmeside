import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { parseJsonArray, toJsonArray } from "@/utils/jsonArray";

export async function POST(req: NextRequest) {
  const { technologies, ...data } = await req.json();
  const project = await prisma.project.create({
    data: { ...data, technologies: toJsonArray(technologies ?? []) },
  });
  return NextResponse.json({
    ...project,
    technologies: parseJsonArray(project.technologies),
  });
}
