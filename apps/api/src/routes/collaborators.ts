import { Hono } from "hono";
import { prisma } from "@wishlist/database";
import type { AuthVariables } from "../middleware/auth";
import { getWishlistWithRole } from "../lib/wishlistAccess";
import { deleteAnonymousUser } from "../lib/deleteAnonymousUser";

const collaborators = new Hono<{ Variables: AuthVariables }>();

/**
 * GET /api/wishlists/:wishlistId/collaborators
 * Get all collaborators for the current wishlist
 */
collaborators.get("/", async (c) => {
  const session = c.get("session");
  const userId = session.user.id;
  const wishlistId = c.req.param("wishlistId");

  if (!wishlistId) return c.json({ error: "Wishlist ID is required" }, 400);

  const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
  if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
  if (!role) return c.json({ error: "Forbidden" }, 403);

  const wishlistCollaborators = await prisma.collaborator.findMany({
    where: { wishlistId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return c.json(wishlistCollaborators);
});

/**
 * PATCH /api/wishlists/:wishlistId/collaborators/:collaboratorUserId
 * Update a collaborator's role (owner only)
 */
collaborators.patch("/:collaboratorUserId", async (c) => {
  const session = c.get("session");
  const userId = session.user.id;
  const wishlistId = c.req.param("wishlistId");
  const collaboratorUserId = c.req.param("collaboratorUserId");
  const body = await c.req.json<{ role: string }>();

  if (!wishlistId) return c.json({ error: "Wishlist ID is required" }, 400);

  const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
  if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
  if (role !== "owner") return c.json({ error: "Forbidden" }, 403);

  const updated = await prisma.collaborator.update({
    where: { wishlistId_userId: { wishlistId, userId: collaboratorUserId } },
    data: { role: body.role },
  });

  return c.json(updated);
});

/**
 * DELETE /api/wishlists/:wishlistId/collaborators/:collaboratorUserId
 * Remove a collaborator. Owner can remove anyone; collaborators can remove themselves.
 * Releases the target's claims on this wishlist. Cleans up anonymous users.
 */
collaborators.delete("/:collaboratorUserId", async (c) => {
  const session = c.get("session");
  const userId = session.user.id;
  const wishlistId = c.req.param("wishlistId");
  const collaboratorUserId = c.req.param("collaboratorUserId");

  if (!wishlistId) return c.json({ error: "Wishlist ID is required" }, 400);

  const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
  if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
  if (!role) return c.json({ error: "Forbidden" }, 403);

  const isSelfLeave = collaboratorUserId === userId;
  const isOwnerRemoving = role === "owner";

  if (!isSelfLeave && !isOwnerRemoving) {
    return c.json({ error: "Forbidden" }, 403);
  }

  // Owner cannot leave their own wishlist — delete the wishlist instead
  if (isSelfLeave && role === "owner") {
    return c.json({ error: "Owners cannot leave their own wishlist" }, 400);
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.item.updateMany({
        where: {
          wishlistId,
          claimedByUserId: collaboratorUserId,
        },
        data: {
          status: "want",
          claimedByUserId: null,
        },
      });

      await tx.collaborator.delete({
        where: {
          wishlistId_userId: { wishlistId, userId: collaboratorUserId },
        },
      });

      await deleteAnonymousUser(collaboratorUserId, tx);
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Error removing collaborator:", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return c.json({ error: "Collaborator not found" }, 404);
    }
    return c.json({ error: "Failed to remove collaborator" }, 500);
  }
});

export default collaborators;
