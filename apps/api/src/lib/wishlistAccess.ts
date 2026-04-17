import { prisma } from "@wishlist/database";

type WishlistRole = "owner" | "editor" | "viewer" | null;

export const getUserWishlistRole = async (
  wishlistId: string,
  userId: string,
): Promise<WishlistRole> => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
  });

  if (!wishlist) return null;

  if (wishlist.ownerId === userId) return "owner";

  const collaborator = await prisma.collaborator.findUnique({
    where: {
      wishlistId_userId: { wishlistId, userId },
    },
  });

  if (!collaborator) return null;

  return collaborator.role as WishlistRole;
};

export const getWishlistWithRole = async (
  wishlistId: string,
  userId: string | null,
) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
  });

  if (!wishlist) return { wishlist: null, role: null };
  if (wishlist.ownerId === userId) return { wishlist, role: "owner" as const };
  if (wishlist.visibility === "public")
    return { wishlist, role: "viewer" as const };

  if (!userId) return { wishlist, role: null };

  const collaborator = await prisma.collaborator.findUnique({
    where: { wishlistId_userId: { wishlistId, userId } },
  });

  if (!collaborator) return { wishlist, role: null };

  return { wishlist, role: collaborator.role as WishlistRole };
};
