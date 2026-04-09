import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || "" });
export const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.item.deleteMany();
  await prisma.collaborator.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      id: "test-user",
      email: "test@test.com",
      name: "Toto Kartonio",
    },
  });

  const wishlists = await Promise.all([
    prisma.wishlist.create({
      data: {
        name: "Test Wishlist",
        description: "Test wishlist",
        ownerId: "test-user",
      },
    }),
  ]);

  const items = await Promise.all([
    prisma.item.create({
      data: {
        name: "Sony WH-1000XM5 Headphones",
        price: 350,
        currency: "EUR",
        status: "want",
        link: "https://www.amazon.de/dp/B09XS7JWHH",
        image: "Image",
        wishlistId: wishlists[0].id,
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
        wishlistId: wishlists[0].id,
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
        wishlistId: wishlists[0].id,
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
