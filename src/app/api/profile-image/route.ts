import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const DEFAULT_IMAGE = "/images/diggn5998-min.jpg";

// Serve the uploaded profile image, or redirect to the bundled default
export async function GET(request: NextRequest) {
  const image = await prisma.profileImage.findUnique({
    where: { id: "main" },
  });
  if (!image) {
    return NextResponse.redirect(new URL(DEFAULT_IMAGE, request.url));
  }
  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.mimeType,
      // URL carries ?v=<updatedAt>, so it is safe to cache aggressively
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP or GIF images are allowed" },
      { status: 400 },
    );
  if (file.size > MAX_BYTES)
    return NextResponse.json(
      { error: "Image must be 5 MB or smaller" },
      { status: 400 },
    );

  const data = Buffer.from(await file.arrayBuffer());
  const image = await prisma.profileImage.upsert({
    where: { id: "main" },
    create: { id: "main", data, mimeType: file.type },
    update: { data, mimeType: file.type },
  });
  return NextResponse.json({ updatedAt: image.updatedAt.getTime() });
}

// Revert to the bundled default image
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.profileImage.deleteMany({ where: { id: "main" } });
  return NextResponse.json({ success: true });
}
