import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || "" });
export const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.item.deleteMany();

  const items = await Promise.all([
    prisma.item.create({
      data: {
        name: "Sony WH-1000XM5 Headphones",
        price: 350,
        currency: "EUR",
        status: "want",
        link: "https://www.amazon.de/dp/B09XS7JWHH",
        image: "Image",
      },
    }),
    prisma.item.create({
      data: {
        name: 'MacBook Pro 16"',
        price: 2500,
        currency: "USD",
        status: "want",
        link: "https://www.apple.com/macbook-pro",
        image: "Image",
      },
    }),
    prisma.item.create({
      data: {
        name: "Mechanical Keyboard",
        price: 150,
        currency: "USD",
        status: "bought",
        link: "https://www.keychron.com",
        image: "Image",
      },
    }),
  ]);

  console.log("✅ Created items:", items.length);
  items.forEach((item) => {
    console.log(`  - ${item.name} (${item.currency}${item.price})`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
