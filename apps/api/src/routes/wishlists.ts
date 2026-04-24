import { Hono } from "hono";
import { prisma } from "@wishlist/database";
import {
  WISHLIST_VISIBILITY,
  type CreateWishlistDto,
  type UpdateWishlistDto,
  type WishlistRole,
} from "@wishlist/types";
import type { AuthVariables } from "../middleware/auth";
import { getWishlistWithRole } from "../lib/wishlistAccess";
import { auth } from "../auth";
import { deleteAnonymousUser } from "../lib/deleteAnonymousUser";

const wishlists = new Hono<{ Variables: AuthVariables }>();

wishlists.get("/", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const [ownedWishlists, collaboratedWishlists] = await Promise.all([
      prisma.wishlist.findMany({
        where: { ownerId: session.user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.collaborator.findMany({
        where: { userId: session.user.id },
        include: { wishlist: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const result = [
      ...ownedWishlists.map((w) => ({ ...w, role: "owner" as const })),
      ...collaboratedWishlists.map((c) => ({
        ...c.wishlist,
        role: c.role as WishlistRole,
      })),
    ];

    return c.json(result);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    return c.json({ error: "Failed to fetch wishlists" }, 500);
  }
});

wishlists.get("/:wishlistId", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const userId = session?.user.id ?? null;
    const wishlistId = c.req.param("wishlistId");

    if (!wishlistId) return c.json({ error: "Wishlist ID is required" }, 400);

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (!role) return c.json({ error: "Forbidden" }, 403);

    return c.json({ ...wishlist, role });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return c.json({ error: "Failed to fetch wishlist" }, 500);
  }
});

wishlists.post("/", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json<CreateWishlistDto>();

    if (!body.name) return c.json({ error: "Name is required" }, 400);

    if (
      body.visibility !== undefined &&
      !WISHLIST_VISIBILITY.includes(body.visibility)
    ) {
      return c.json({ error: "Invalid visibility" }, 400);
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        name: body.name,
        description: body.description,
        visibility: body.visibility || "private",
        hideClaimsFromOwner: body.hideClaimsFromOwner,
        ownerId: session.user.id,
      },
    });

    return c.json(wishlist, 201);
  } catch (error) {
    console.error("Error creating wishlist:", error);
    return c.json({ error: "Failed to create wishlist" }, 500);
  }
});

wishlists.patch("/:wishlistId", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const wishlistId = c.req.param("wishlistId");
    const body = await c.req.json<UpdateWishlistDto>();

    if (!wishlistId) return c.json({ error: "Wishlist ID is required" }, 400);

    const { wishlist, role } = await getWishlistWithRole(
      wishlistId,
      session.user.id,
    );
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (role !== "owner") return c.json({ error: "Forbidden" }, 403);

    if (
      body.visibility !== undefined &&
      !WISHLIST_VISIBILITY.includes(body.visibility)
    ) {
      return c.json({ error: "Invalid visibility" }, 400);
    }

    const isGoingPrivate =
      body.visibility === "private" && wishlist.visibility !== "private";

    const updated = await prisma.$transaction(async (tx) => {
      if (isGoingPrivate) {
        // Collect claimers whose claims we're about to release,
        // so we can clean up anonymous ones afterwards
        const claimedItems = await tx.item.findMany({
          where: {
            wishlistId,
            claimedByUserId: { not: null },
            // Exclude claims by the owner themselves — they're keeping access
            NOT: { claimedByUserId: wishlist.ownerId },
          },
          select: { claimedByUserId: true },
        });

        const formerClaimerIds = claimedItems
          .map((i) => i.claimedByUserId)
          .filter((id): id is string => id !== null);

        // Release their claims
        if (formerClaimerIds.length > 0) {
          await tx.item.updateMany({
            where: {
              wishlistId,
              claimedByUserId: { in: formerClaimerIds },
            },
            data: {
              status: "want",
              claimedByUserId: null,
            },
          });
        }

        // Remove all collaborators
        await tx.collaborator.deleteMany({
          where: { wishlistId },
        });

        // Invalidate pending invite links
        await tx.inviteLink.deleteMany({
          where: { wishlistId },
        });

        // Clean up any former claimers who were anonymous with no claims left
        for (const claimerId of formerClaimerIds) {
          await deleteAnonymousUser(claimerId, tx);
        }
      }

      return tx.wishlist.update({
        where: { id: wishlistId },
        data: body,
      });
    });

    return c.json(updated);
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return c.json({ error: "Failed to update wishlist" }, 500);
  }
});

wishlists.delete("/:wishlistId", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const wishlistId = c.req.param("wishlistId");

    if (!wishlistId) return c.json({ error: "Wishlist ID is required" }, 400);

    const { wishlist, role } = await getWishlistWithRole(
      wishlistId,
      session.user.id,
    );
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (role !== "owner") return c.json({ error: "Forbidden" }, 403);

    await prisma.$transaction(async (tx) => {
      // Collect claimers before cascade delete so we can clean up anonymous ones
      const claimedItems = await tx.item.findMany({
        where: {
          wishlistId,
          claimedByUserId: { not: null },
        },
        select: { claimedByUserId: true },
      });

      const formerClaimerIds = claimedItems
        .map((i) => i.claimedByUserId)
        .filter((id): id is string => id !== null);

      // Before deleting the wishlist, release claims so the FK Restrict doesn't block
      if (formerClaimerIds.length > 0) {
        await tx.item.updateMany({
          where: {
            wishlistId,
            claimedByUserId: { in: formerClaimerIds },
          },
          data: {
            status: "want",
            claimedByUserId: null,
          },
        });
      }

      await tx.wishlist.delete({ where: { id: wishlistId } });

      for (const claimerId of formerClaimerIds) {
        await deleteAnonymousUser(claimerId, tx);
      }
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    return c.json({ error: "Failed to delete wishlist" }, 500);
  }
});

export default wishlists;
