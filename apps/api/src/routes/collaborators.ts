import { Hono } from "hono";
import { prisma } from "@wishlist/database";
import type { AuthVariables } from "../middleware/auth";
import { getWishlistWithRole } from "../lib/wishlistAccess";

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
  if (role !== "owner") return c.json({ error: "Forbidden" }, 403);

  const wishlistCollaborators = await prisma.collaborator.findMany({
    where: { wishlistId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return c.json(wishlistCollaborators);
});

/**
 * POST /api/wishlists/:wishlistId/collaborators
 * invite new collaborator
 */
collaborators.post("/", async (c) => {
  const session = c.get("session");
  const userId = session.user.id;
  const wishlistId = c.req.param("wishlistId");
  const body = await c.req.json<{ email: string; role?: string }>();

  if (!wishlistId) return c.json({ error: "Wishlist ID is required" }, 400);
  if (!body.email) return c.json({ error: "Email is required" }, 400);

  const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
  if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
  if (role !== "owner") return c.json({ error: "Forbidden" }, 403);

  const targetUser = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!targetUser) return c.json({ error: "User not found" }, 404);
  if (targetUser.id === userId) {
    return c.json({ error: "Cannot add yourself as collaborator" }, 400);
  }

  const collaborator = await prisma.collaborator.create({
    data: {
      wishlistId,
      userId: targetUser.id,
      role: body.role || "viewer",
    },
  });

  return c.json(collaborator, 201);
});

/**
 * PATCH /api/wishlists/:wishlistId/collaborators/:collaboratorUserId
 * Update a collaborator
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
 * DELETE /api/wishlists/:wishlistId/collaborator/:userId
 * Delete a collaborator
 */
collaborators.delete("/:collaboratorUserId", async (c) => {
  const session = c.get("session");
  const userId = session.user.id;
  const wishlistId = c.req.param("wishlistId");
  const collaboratorUserId = c.req.param("collaboratorUserId");

  if (!wishlistId) return c.json({ error: "Wishlist ID is required" }, 400);

  const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
  if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
  if (role !== "owner") return c.json({ error: "Forbidden" }, 403);

  await prisma.collaborator.delete({
    where: { wishlistId_userId: { wishlistId, userId: collaboratorUserId } },
  });

  return c.json({ success: true });
});

export default collaborators;
