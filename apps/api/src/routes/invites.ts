import { Hono } from "hono";
import { prisma } from "@wishlist/database";
import type { AuthVariables } from "../middleware/auth";
import { getWishlistWithRole } from "../lib/wishlistAccess";

const invites = new Hono<{ Variables: AuthVariables }>();

/**
 * POST /api/wishlists/:wishlistId/invites
 * Generate an invite link (owner only)
 */
invites.post("/", async (c) => {
  try {
    const session = c.get("session");
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");
    const body = await c.req
      .json<{ expiresInDays?: number }>()
      .catch(() => ({ expiresInDays: undefined }));

    if (!wishlistId) return c.json({ error: "Wishlist ID is required" }, 400);

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (role !== "owner") return c.json({ error: "Forbidden" }, 403);

    const expiresInDays = body.expiresInDays ?? 1;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const invite = await prisma.inviteLink.create({
      data: {
        wishlistId,
        token: crypto.randomUUID(),
        expiresAt,
      },
    });

    return c.json(
      {
        ...invite,
        url: `${process.env.CLIENT_URL || "http://localhost:5173"}/invites/${invite.token}`,
      },
      201,
    );
  } catch (error) {
    console.error("Error creating invite:", error);
    return c.json({ error: "Failed to create invite" }, 500);
  }
});

export default invites;
