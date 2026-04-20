import { Hono } from "hono";
import { prisma } from "@wishlist/database";
import type { AuthVariables } from "../middleware/auth";
import { auth } from "../auth";

const users = new Hono<{ Variables: AuthVariables }>();

users.get("/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const user = await prisma.user.findUnique({
      select: { id: true, name: true },
      where: { id: userId },
    });
    if (!user) return c.json({ error: "User not found" }, 404);

    return c.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

users.get("/:userId/wishlists", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const requesterId = session?.user.id ?? null;
    const userId = c.req.param("userId");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return c.json({ error: "User not found" }, 404);

    const wishlists = await prisma.wishlist.findMany({
      where: {
        ownerId: userId,
        OR: [
          { visibility: "public" },
          ...(requesterId
            ? [{ collaborators: { some: { userId: requesterId } } }]
            : []),
        ],
      },
    });

    return c.json(wishlists);
  } catch (error) {
    console.error("Error fetching user wishlists:", error);
    return c.json({ error: "Failed to fetch user wishlists" }, 500);
  }
});

export default users;
