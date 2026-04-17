import { Hono } from "hono";
import { prisma } from "@wishlist/database";
import type { AuthVariables } from "../middleware/auth";
import { getWishlistWithRole } from "../lib/wishlistAccess";
import { auth } from "../auth";

const wishlists = new Hono<{ Variables: AuthVariables }>();

wishlists.get("/", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const userWishlists = await prisma.wishlist.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return c.json(userWishlists);
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

    return c.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return c.json({ error: "Failed to fetch wishlist" }, 500);
  }
});

wishlists.post("/", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json<{
      name: string;
      description?: string;
      visibility?: string;
    }>();

    if (!body.name) return c.json({ error: "Name is required" }, 400);

    const wishlist = await prisma.wishlist.create({
      data: {
        name: body.name,
        description: body.description,
        visibility: body.visibility || "private",
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
    const body = await c.req.json<{
      name?: string;
      description?: string;
      visibility?: string;
    }>();

    if (!wishlistId) return c.json({ error: "Wishlist ID is required" }, 400);

    const { wishlist, role } = await getWishlistWithRole(
      wishlistId,
      session.user.id,
    );
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (role !== "owner") return c.json({ error: "Forbidden" }, 403);

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

    await prisma.wishlist.delete({ where: { id: wishlistId } });

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    return c.json({ error: "Failed to delete wishlist" }, 500);
  }
});

export default wishlists;
