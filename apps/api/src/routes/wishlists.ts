import { Hono } from "hono";
import { prisma } from "@wishlist/database";
import type { AuthVariables } from "../middleware/auth";

const wishlists = new Hono<{ Variables: AuthVariables }>();

/**
 * GET /api/wishlists
 * Get all wishlists for the current user
 */
wishlists.get("/", async (c) => {
  try {
    const session = c.get("session");
    const userId = session.user.id;

    const userWishlists = await prisma.wishlist.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    });

    return c.json(userWishlists);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    return c.json({ error: "Failed to fetch wishlists" }, 500);
  }
});

/**
 * GET /api/wishlists/:wishlistId
 * Get a single wishlist
 */
wishlists.get("/:wishlistId", async (c) => {
  try {
    const session = c.get("session");
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");

    const wishlist = await prisma.wishlist.findUnique({
      where: { id: wishlistId },
    });

    if (!wishlist) {
      return c.json({ error: "Wishlist not found" }, 404);
    }

    if (wishlist.ownerId !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    return c.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return c.json({ error: "Failed to fetch wishlist" }, 500);
  }
});

/**
 * POST /api/wishlists
 * Create a new wishlist
 */
wishlists.post("/", async (c) => {
  try {
    const session = c.get("session");
    const userId = session.user.id;
    const body = await c.req.json<{
      name: string;
      description?: string;
      visibility?: string;
    }>();

    if (!body.name) {
      return c.json({ error: "Name is required" }, 400);
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        name: body.name,
        description: body.description,
        visibility: body.visibility || "private",
        ownerId: userId,
      },
    });

    return c.json(wishlist, 201);
  } catch (error) {
    console.error("Error creating wishlist:", error);
    return c.json({ error: "Failed to create wishlist" }, 500);
  }
});

/**
 * PATCH /api/wishlists/:wishlistId
 * Update a wishlist
 */
wishlists.patch("/:wishlistId", async (c) => {
  try {
    const session = c.get("session");
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");
    const body = await c.req.json<{
      name?: string;
      description?: string;
      visibility?: string;
    }>();

    const wishlist = await prisma.wishlist.findUnique({
      where: { id: wishlistId },
    });

    if (!wishlist) {
      return c.json({ error: "Wishlist not found" }, 404);
    }

    if (wishlist.ownerId !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const updated = await prisma.wishlist.update({
      where: { id: wishlistId },
      data: body,
    });

    return c.json(updated);
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return c.json({ error: "Failed to update wishlist" }, 500);
  }
});

/**
 * DELETE /api/wishlists/:wishlistId
 * Delete a wishlist
 */
wishlists.delete("/:wishlistId", async (c) => {
  try {
    const session = c.get("session");
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");

    const wishlist = await prisma.wishlist.findUnique({
      where: { id: wishlistId },
    });

    if (!wishlist) {
      return c.json({ error: "Wishlist not found" }, 404);
    }

    if (wishlist.ownerId !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await prisma.wishlist.delete({
      where: { id: wishlistId },
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    return c.json({ error: "Failed to delete wishlist" }, 500);
  }
});

export default wishlists;
