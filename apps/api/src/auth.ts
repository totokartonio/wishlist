import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@wishlist/database/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "",
});

const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
});
