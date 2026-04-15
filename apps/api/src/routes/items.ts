import { Hono } from "hono";
import { prisma } from "@wishlist/database";
import type { CreateItemDto, UpdateItemDto } from "@wishlist/types";
import type { AuthVariables } from "../middleware/auth";
import { getWishlistWithRole } from "../lib/wishlistAccess";

const items = new Hono<{ Variables: AuthVariables }>();

/**
 * GET /api/wishlists/:wishlistId/items
 * Get all items in a wishlist
 */
items.get("/", async (c) => {
  try {
    const session = c.get("session");
    const userId = session.user.id;
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

    return c.json(wishlistItems);
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
    const session = c.get("session");
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");
    const id = c.req.param("id");

    if (!wishlistId) {
      return c.json({ error: "Wishlist ID is required" }, 400);
    }

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (!role) return c.json({ error: "Forbidden" }, 403);

    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return c.json({ error: "Item not found" }, 404);
    }

    return c.json(item);
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
    const session = c.get("session");
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");
    const body = await c.req.json<CreateItemDto>();

    if (!wishlistId) {
      return c.json({ error: "Wishlist ID is required" }, 400);
    }

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (!role || role === "viewer") return c.json({ error: "Forbidden" }, 403);

    if (
      !body.name ||
      body.price === undefined ||
      !body.currency ||
      !body.link
    ) {
      return c.json(
        {
          error: "Missing required fields",
          required: ["name", "price", "currency", "link"],
        },
        400,
      );
    }

    if (body.price < 0) {
      return c.json({ error: "Price must be a positive number" }, 400);
    }

    const item = await prisma.item.create({
      data: {
        name: body.name,
        price: body.price,
        currency: body.currency,
        status: body.status || "want",
        link: body.link,
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
    const session = c.get("session");
    const userId = session.user.id;
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

    const item = await prisma.item.update({
      where: { id },
      data: body,
    });

    return c.json(item);
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
    const session = c.get("session");
    const userId = session.user.id;
    const wishlistId = c.req.param("wishlistId");
    const id = c.req.param("id");

    if (!wishlistId) {
      return c.json({ error: "Wishlist ID is required" }, 400);
    }

    const { wishlist, role } = await getWishlistWithRole(wishlistId, userId);
    if (!wishlist) return c.json({ error: "Wishlist not found" }, 404);
    if (!role || role === "viewer") return c.json({ error: "Forbidden" }, 403);

    await prisma.item.delete({
      where: { id },
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

export default items;
