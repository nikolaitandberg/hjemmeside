// Run once to create the admin user:
//   node scripts/create-admin.mjs
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "changeme";

const hash = await bcrypt.hash(PASSWORD, 10);
const user = await prisma.user.upsert({
  where: { email: EMAIL },
  update: { password: hash },
  create: { email: EMAIL, password: hash },
});
console.log("Admin user ready:", user.email);
await prisma.$disconnect();
