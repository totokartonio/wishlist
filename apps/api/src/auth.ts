import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@wishlist/database/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "",
});

const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:5173"],
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        const anonymousId = anonymousUser.user.id;
        const newId = newUser.user.id;

        await prisma.$transaction(async (tx) => {
          // Transfer claims
          await tx.item.updateMany({
            where: { claimedByUserId: anonymousId },
            data: { claimedByUserId: newId },
          });

          // Find wishlists where the new user is already a collaborator —
          // we can't move the anonymous row there due to the unique constraint
          const existingMemberships = await tx.collaborator.findMany({
            where: { userId: newId },
            select: { wishlistId: true },
          });

          const existingWishlistIds = existingMemberships.map(
            (m) => m.wishlistId,
          );

          // Delete anonymous collaborations on wishlists where new user already has a row
          if (existingWishlistIds.length > 0) {
            await tx.collaborator.deleteMany({
              where: {
                userId: anonymousId,
                wishlistId: { in: existingWishlistIds },
              },
            });
          }

          // Transfer the rest
          await tx.collaborator.updateMany({
            where: { userId: anonymousId },
            data: { userId: newId },
          });
        });
      },
    }),
  ],
});
