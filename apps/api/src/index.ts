import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { requireAuth } from "./middleware/auth";
import wishlists from "./routes/wishlists";
import items from "./routes/items";

const app = new Hono();

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  "/*",
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Set-Cookie"],
    credentials: true,
  }),
);

app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${c.req.method} ${c.req.url} - ${ms}ms`);
});

// ============================================================
// AUTH ROUTES
// ============================================================

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// ============================================================
// PROTECTED ROUTES
// ============================================================

app.use("/api/wishlists/*", requireAuth);
app.route("/api/wishlists", wishlists);
app.route("/api/wishlists/:wishlistId/items", items);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// 404 HANDLER
// ============================================================

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
║   • GET    /api/wishlists              ║
║   • POST   /api/wishlists              ║
║   • GET    /api/wishlists/:id          ║
║   • PUT    /api/wishlists/:id          ║
║   • DELETE /api/wishlists/:id          ║
║   • GET    /api/wishlists/:id/items    ║
║   • POST   /api/wishlists/:id/items    ║
║   • PATCH  /api/wishlists/:id/items/:id║
║   • DELETE /api/wishlists/:id/items/:id║
║                                        ║
╚════════════════════════════════════════╝
`);

export default {
  port,
  fetch: app.fetch,
};
