import { prisma } from "@wishlist/database";
import type {
  PrismaClient,
  Prisma,
} from "@wishlist/database/generated/prisma/client";

export const deleteAnonymousUser = async (
  userId: string,
  tx: PrismaClient | Prisma.TransactionClient = prisma,
): Promise<void> => {
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { isAnonymous: true },
  });

  if (!user || !user.isAnonymous) return;

  const claimCount = await tx.item.count({
    where: { claimedByUserId: userId },
  });

  if (claimCount > 0) return;

  await tx.user.delete({ where: { id: userId } });
};
