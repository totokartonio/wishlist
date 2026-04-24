import { Hono } from "hono";
import { prisma } from "@wishlist/database";
import {
  ITEM_STATUSES,
  type CreateItemDto,
  type UpdateItemDto,
} from "@wishlist/types";
import type { AuthVariables } from "../middleware/auth";
import { getWishlistWithRole } from "../lib/wishlistAccess";
import { auth } from "../auth";
import { deleteAnonymousUser } from "../lib/deleteAnonymousUser";
import { filterItemsForRole } from "../lib/itemFiltering";

const items = new Hono<{ Variables: AuthVariables }>();

/**
 * GET /api/wishlists/:wishlistId/items
 * Get all items in a wishlist
 */
items.get("/", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const userId = session?.user.id ?? null;
    const wishlistId = c.req.param("wishlistId");

    if (!wishlistId) {
      return c.json({ error: "Wishlist ID is required" }, 400);
    }

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (!role) return c.json({ error: "Forbidden" }, 403);

    const wishlistItems = await prisma.item.findMany({
      where: { wishlistId },
      orderBy: { createdAt: "desc" },
    });

    const filtered = filterItemsForRole(
      wishlistItems,
      role,
      wishlist.hideClaimsFromOwner,
      userId,
    );

    return c.json(filtered);
  } catch (error) {
    console.error("Error fetching items:", error);
    return c.json({ error: "Failed to fetch items" }, 500);
  }
});

/**
 * GET /api/wishlists/:wishlistId/items/:id
 * Get a single item
 */
items.get("/:id", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const userId = session?.user.id ?? null;
    const wishlistId = c.req.param("wishlistId");
    const id = c.req.param("id");

    if (!wishlistId) {
      return c.json({ error: "Wishlist ID is required" }, 400);
    }

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (!role) return c.json({ error: "Forbidden" }, 403);

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return c.json({ error: "Item not found" }, 404);
    if (item.wishlistId !== wishlistId) {
      return c.json({ error: "Item not found" }, 404);
    }

    const [filtered] = filterItemsForRole(
      [item],
      role,
      wishlist.hideClaimsFromOwner,
      userId,
    );

    if (!filtered) return c.json({ error: "Item not found" }, 404);

    return c.json(filtered);
  } catch (error) {
    console.error("Error fetching item:", error);
    return c.json({ error: "Failed to fetch item" }, 500);
  }
});

/**
 * POST /api/wishlists/:wishlistId/items
 * Create a new item
 */
items.post("/", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");
    const body = await c.req.json<CreateItemDto>();

    if (!wishlistId) {
      return c.json({ error: "Wishlist ID is required" }, 400);
    }

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (!role || role === "viewer") return c.json({ error: "Forbidden" }, 403);

    if (!body.name) {
      return c.json(
        {
          error: "Missing required fields",
          required: ["name"],
        },
        400,
      );
    }

    if (body.price !== undefined && body.price < 0) {
      return c.json({ error: "Price must be a positive number" }, 400);
    }

    if (body.status !== undefined && !ITEM_STATUSES.includes(body.status)) {
      return c.json({ error: "Invalid status" }, 400);
    }

    // New items start in "want" state — force-creating as "claimed" makes no sense
    if (body.status === "claimed") {
      return c.json({ error: "New items cannot be created as claimed" }, 400);
    }

    const item = await prisma.item.create({
      data: {
        name: body.name,
        price: body.price ?? 0,
        currency: body.currency ?? null,
        status: body.status || "want",
        link: body.link || "",
        image: body.image || "Image",
        wishlistId,
      },
    });

    return c.json(item, 201);
  } catch (error) {
    console.error("Error creating item:", error);
    return c.json({ error: "Failed to create item" }, 500);
  }
});

/**
 * PATCH /api/wishlists/:wishlistId/items/:id
 * Update an item
 */
items.patch("/:id", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const userId = session?.user.id ?? null;
    const wishlistId = c.req.param("wishlistId");
    const id = c.req.param("id");
    const body = await c.req.json<UpdateItemDto>();

    if (!wishlistId) {
      return c.json({ error: "Wishlist ID is required" }, 400);
    }

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (!role) return c.json({ error: "Forbidden" }, 403);

    const isStatusOnly =
      Object.keys(body).length === 1 && body.status !== undefined;

    if (!isStatusOnly && role === "viewer") {
      return c.json({ error: "Forbidden" }, 403);
    }

    if (body.price !== undefined && body.price < 0) {
      return c.json({ error: "Price must be a positive number" }, 400);
    }

    if (body.status !== undefined && !ITEM_STATUSES.includes(body.status)) {
      return c.json({ error: "Invalid status" }, 400);
    }

    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) return c.json({ error: "Item not found" }, 404);
    if (existing.wishlistId !== wishlistId) {
      return c.json({ error: "Item not found" }, 404);
    }

    // Reject force-claim via PATCH — claim endpoint is the only path to claim
    if (body.status === "claimed" && existing.status === "want") {
      return c.json({ error: "Use the claim endpoint to claim items" }, 400);
    }

    const isForceUnclaim =
      body.status === "want" &&
      existing.status === "claimed" &&
      existing.claimedByUserId !== null;

    const formerClaimerId = isForceUnclaim ? existing.claimedByUserId : null;

    const updated = await prisma.$transaction(async (tx) => {
      const updatedItem = await tx.item.update({
        where: { id },
        data: {
          ...body,
          ...(isForceUnclaim ? { claimedByUserId: null } : {}),
        },
      });

      if (formerClaimerId) {
        await deleteAnonymousUser(formerClaimerId, tx);
      }

      return updatedItem;
    });

    const [filtered] = filterItemsForRole(
      [updated],
      role,
      wishlist.hideClaimsFromOwner,
      userId,
    );

    if (!filtered) return c.json({ error: "Item not found" }, 404);

    return c.json(filtered);
  } catch (error) {
    console.error("Error updating item:", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return c.json({ error: "Item not found" }, 404);
    }
    return c.json({ error: "Failed to update item" }, 500);
  }
});

/**
 * DELETE /api/wishlists/:wishlistId/items/:id
 * Delete an item
 */
items.delete("/:id", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");
    const id = c.req.param("id");

    if (!wishlistId) {
      return c.json({ error: "Wishlist ID is required" }, 400);
    }

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (!role || role === "viewer") return c.json({ error: "Forbidden" }, 403);

    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) return c.json({ error: "Item not found" }, 404);
    if (existing.wishlistId !== wishlistId) {
      return c.json({ error: "Item not found" }, 404);
    }

    const formerClaimerId = existing.claimedByUserId;

    await prisma.$transaction(async (tx) => {
      await tx.item.delete({ where: { id } });

      if (formerClaimerId) {
        await deleteAnonymousUser(formerClaimerId, tx);
      }
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return c.json({ error: "Item not found" }, 404);
    }
    return c.json({ error: "Failed to delete item" }, 500);
  }
});

/**
 * POST /api/wishlists/:wishlistId/items/:id/claim
 * Claim an item
 */
items.post("/:id/claim", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");
    const id = c.req.param("id");

    if (!wishlistId) {
      return c.json({ error: "Wishlist ID is required" }, 400);
    }

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (!role) return c.json({ error: "Forbidden" }, 403);

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return c.json({ error: "Item not found" }, 404);
    if (item.wishlistId !== wishlistId) {
      return c.json({ error: "Item not found" }, 404);
    }
    if (item.archived) {
      return c.json({ error: "Item is archived" }, 409);
    }
    if (item.claimedByUserId) {
      return c.json({ error: "Item is already claimed" }, 409);
    }

    const updated = await prisma.item.update({
      where: { id },
      data: {
        status: "claimed",
        claimedByUserId: userId,
      },
    });

    return c.json(updated);
  } catch (error) {
    console.error("Error claiming item:", error);
    return c.json({ error: "Failed to claim item" }, 500);
  }
});

/**
 * POST /api/wishlists/:wishlistId/items/:id/unclaim
 * Unclaim an item (only the current claimer can do this)
 */
items.post("/:id/unclaim", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");
    const id = c.req.param("id");

    if (!wishlistId) {
      return c.json({ error: "Wishlist ID is required" }, 400);
    }

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return c.json({ error: "Item not found" }, 404);
    if (item.wishlistId !== wishlistId) {
      return c.json({ error: "Item not found" }, 404);
    }
    if (!item.claimedByUserId) {
      return c.json({ error: "Item is not claimed" }, 409);
    }
    if (item.claimedByUserId !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedItem = await tx.item.update({
        where: { id },
        data: {
          status: "want",
          claimedByUserId: null,
        },
      });

      await deleteAnonymousUser(userId, tx);

      return updatedItem;
    });

    return c.json(updated);
  } catch (error) {
    console.error("Error unclaiming item:", error);
    return c.json({ error: "Failed to unclaim item" }, 500);
  }
});

/**
 * POST /api/wishlists/:wishlistId/items/:id/archive
 * Archive an item (owner/editor only)
 */
items.post("/:id/archive", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");
    const id = c.req.param("id");

    if (!wishlistId) {
      return c.json({ error: "Wishlist ID is required" }, 400);
    }

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (!role || role === "viewer") return c.json({ error: "Forbidden" }, 403);

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return c.json({ error: "Item not found" }, 404);
    if (item.wishlistId !== wishlistId) {
      return c.json({ error: "Item not found" }, 404);
    }
    if (item.archived) {
      return c.json({ error: "Item is already archived" }, 409);
    }

    const updated = await prisma.item.update({
      where: { id },
      data: { archived: true },
    });

    const [filtered] = filterItemsForRole(
      [updated],
      role,
      wishlist.hideClaimsFromOwner,
      userId,
    );

    if (!filtered) return c.json({ error: "Item not found" }, 404);

    return c.json(filtered);
  } catch (error) {
    console.error("Error archiving item:", error);
    return c.json({ error: "Failed to archive item" }, 500);
  }
});

/**
 * POST /api/wishlists/:wishlistId/items/:id/unarchive
 * Unarchive an item (owner/editor only)
 */
items.post("/:id/unarchive", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");
    const id = c.req.param("id");

    if (!wishlistId) {
      return c.json({ error: "Wishlist ID is required" }, 400);
    }

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (!role || role === "viewer") return c.json({ error: "Forbidden" }, 403);

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return c.json({ error: "Item not found" }, 404);
    if (item.wishlistId !== wishlistId) {
      return c.json({ error: "Item not found" }, 404);
    }
    if (!item.archived) {
      return c.json({ error: "Item is not archived" }, 409);
    }

    const updated = await prisma.item.update({
      where: { id },
      data: { archived: false },
    });

    const [filtered] = filterItemsForRole(
      [updated],
      role,
      wishlist.hideClaimsFromOwner,
      userId,
    );

    if (!filtered) return c.json({ error: "Item not found" }, 404);

    return c.json(filtered);
  } catch (error) {
    console.error("Error unarchiving item:", error);
    return c.json({ error: "Failed to unarchive item" }, 500);
  }
});

export default items;
