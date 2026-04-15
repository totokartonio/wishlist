import { Hono } from "hono";
import { prisma } from "@wishlist/database";
import { auth } from "../auth";
import { getWishlistWithRole } from "../lib/wishlistAccess";

const publicInvites = new Hono();

/**
 * GET /api/invites/:token
 * Get wishlist info for an invite token (public)
 */
publicInvites.get("/:token", async (c) => {
  try {
    const token = c.req.param("token");

    const invite = await prisma.inviteLink.findUnique({
      where: { token },
      include: {
        wishlist: {
          select: {
            id: true,
            name: true,
            description: true,
            visibility: true,
          },
        },
      },
    });

    if (!invite) return c.json({ error: "Invite not found" }, 404);
    if (invite.expiresAt < new Date()) {
      return c.json({ error: "Invite link has expired" }, 410);
    }

    return c.json(invite);
  } catch (error) {
    console.error("Error fetching invite:", error);
    return c.json({ error: "Failed to fetch invite" }, 500);
  }
});

/**
 * POST /api/invites/:token/join
 * Join a wishlist via invite link (auth required)
 */
publicInvites.post("/:token/join", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const userId = session.user.id;
    const token = c.req.param("token");

    const invite = await prisma.inviteLink.findUnique({
      where: { token },
    });

    if (!invite) return c.json({ error: "Invite not found" }, 404);
    if (invite.expiresAt < new Date()) {
      return c.json({ error: "Invite link has expired" }, 410);
    }

    const existingRole = await getWishlistWithRole(invite.wishlistId, userId);
    if (existingRole.role) {
      return c.json({ error: "Already a member of this wishlist" }, 400);
    }

    const collaborator = await prisma.collaborator.create({
      data: {
        wishlistId: invite.wishlistId,
        userId,
        role: "viewer",
      },
    });

    return c.json(collaborator, 201);
  } catch (error) {
    console.error("Error joining wishlist:", error);
    return c.json({ error: "Failed to join wishlist" }, 500);
  }
});

export default publicInvites;
