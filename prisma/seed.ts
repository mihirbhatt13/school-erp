import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: {
      email: "admin@gmail.com",
    },
    update: {},
    create: {
      email: "admin@gmail.com",
      password: hashedPassword,
    },
  });

  console.log("✅ Admin Created Successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });