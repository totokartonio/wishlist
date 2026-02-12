import { Hono } from "hono";
import { cors } from "hono/cors";
import { prisma } from "@wishlist/database";
import type { CreateItemDto, UpdateItemDto } from "@wishlist/types";

// Initialize Hono app
const app = new Hono();

// ============================================================
// MIDDLEWARE
// ============================================================

// CORS middleware - allows requests from your Vite dev server
app.use(
  "/*",
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Request logger middleware (optional but helpful)
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${c.req.method} ${c.req.url} - ${ms}ms`);
});

// ============================================================
// ROUTES
// ============================================================

// Health check endpoint - verify server is running
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// ITEMS ENDPOINTS
// ============================================================

/**
 * GET /api/items
 * Fetch all wishlist items
 */
app.get("/api/items", async (c) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
    });

    return c.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return c.json({ error: "Failed to fetch items" }, 500);
  }
});

/**
 * GET /api/items/:id
 * Fetch a single item by ID
 */
app.get("/api/items/:id", async (c) => {
  try {
    const id = c.req.param("id");

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
 * POST /api/items
 * Create a new wishlist item
 *
 * Expected body:
 * {
 *   name: string,
 *   price: number,
 *   currency: "USD" | "EUR" | "RUB",
 *   link: string,
 *   image?: string,
 *   status?: "want" | "bought" | "archived" | "reserved"
 * }
 */
app.post("/api/items", async (c) => {
  try {
    const body = await c.req.json<CreateItemDto>();

    // Validate required fields
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

    // Validate price is positive
    if (body.price < 0) {
      return c.json({ error: "Price must be a positive number" }, 400);
    }

    // Create item in database
    const item = await prisma.item.create({
      data: {
        name: body.name,
        price: body.price,
        currency: body.currency,
        status: body.status || "want",
        link: body.link,
        image: body.image || "Image",
      },
    });

    return c.json(item, 201);
  } catch (error) {
    console.error("Error creating item:", error);
    return c.json({ error: "Failed to create item" }, 500);
  }
});

/**
 * PUT /api/items/:id
 * Update an existing item
 *
 * Expected body (all fields optional):
 * {
 *   name?: string,
 *   price?: number,
 *   currency?: "USD" | "EUR" | "RUB",
 *   link?: string,
 *   image?: string,
 *   status?: "want" | "bought" | "archived" | "reserved"
 * }
 */
app.put("/api/items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json<UpdateItemDto>();

    // Validate price if provided
    if (body.price !== undefined && body.price < 0) {
      return c.json({ error: "Price must be a positive number" }, 400);
    }

    // Update item in database
    const item = await prisma.item.update({
      where: { id },
      data: body,
    });

    return c.json(item);
  } catch (error) {
    console.error("Error updating item:", error);

    // Check if error is because item doesn't exist
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
 * PATCH /api/items/:id
 * Partial update (alias for PUT, works the same way)
 */
app.patch("/api/items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json<UpdateItemDto>();

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
 * DELETE /api/items/:id
 * Delete an item
 */
app.delete("/api/items/:id", async (c) => {
  try {
    const id = c.req.param("id");

    await prisma.item.delete({
      where: { id },
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error("Error deleting item:", error);

    // Check if error is because item doesn't exist
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return c.json({ error: "Item not found" }, 404);
    }

    return c.json({ error: "Failed to delete item" }, 500);
  }
});

// ============================================================
// 404 HANDLER
// ============================================================

// Handle all unmatched routes
app.notFound((c) => {
  return c.json(
    {
      error: "Not Found",
      path: c.req.url,
    },
    404,
  );
});

// ============================================================
// ERROR HANDLER
// ============================================================

// Global error handler
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json(
    {
      error: "Internal Server Error",
      message: err.message,
    },
    500,
  );
});

// ============================================================
// START SERVER
// ============================================================

const port = Number(process.env.PORT) || 3000;

console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   🚀 Wishlist API Server Started       ║
║                                        ║
║   Port:        ${port}                 ║
║   Environment: ${process.env.NODE_ENV || "development"}        ║
║                                        ║
║   Endpoints:                           ║
║   • GET    /health                     ║
║   • GET    /api/items                  ║
║   • GET    /api/items/:id              ║
║   • POST   /api/items                  ║
║   • PUT    /api/items/:id              ║
║   • PATCH  /api/items/:id              ║
║   • DELETE /api/items/:id              ║
║                                        ║
╚════════════════════════════════════════╝
`);

// Export for Bun runtime
export default {
  port,
  fetch: app.fetch,
};
