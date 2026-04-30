import { hash } from "bcryptjs";

import { prisma } from "../lib/prisma";

async function main() {
  const passwordHash = await hash("Password123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      name: "Admin User",
      passwordHash,
      role: "admin",
      updatedAt: new Date(),
    },
    create: {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash,
      role: "admin",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
