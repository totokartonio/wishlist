import { prisma } from "@wishlist/database";
import type { WishlistRole } from "@wishlist/types";

export const getUserWishlistRole = async (
  wishlistId: string,
  userId: string,
): Promise<WishlistRole | null> => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
  });

  if (!wishlist) return null;
  if (wishlist.ownerId === userId) return "owner";

  const collaborator = await prisma.collaborator.findUnique({
    where: { wishlistId_userId: { wishlistId, userId } },
  });

  if (!collaborator) return null;

  return collaborator.role as WishlistRole;
};

export const getWishlistWithRole = async (
  wishlistId: string,
  userId: string | null,
): Promise<{
  wishlist: Awaited<ReturnType<typeof prisma.wishlist.findUnique>>;
  role: WishlistRole | null;
}> => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
  });

  if (!wishlist) return { wishlist: null, role: null };
  if (wishlist.ownerId === userId) return { wishlist, role: "owner" };
  if (wishlist.visibility === "public") return { wishlist, role: "viewer" };
  if (!userId) return { wishlist, role: null };

  const collaborator = await prisma.collaborator.findUnique({
    where: { wishlistId_userId: { wishlistId, userId } },
  });

  if (!collaborator) return { wishlist, role: null };

  return { wishlist, role: collaborator.role as WishlistRole };
};
