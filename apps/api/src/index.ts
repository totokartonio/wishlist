import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { requireAuth } from "./middleware/auth";
import wishlists from "./routes/wishlists";
import items from "./routes/items";
import collaborators from "./routes/collaborators";
import invites from "./routes/invites";
import publicInvites from "./routes/publicInvites";

const app = new Hono();

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

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  console.log("Auth handler reached:", c.req.url);
  return auth.handler(c.req.raw);
});

app.use("/api/wishlists/:wishlistId/collaborators/*", requireAuth);
app.use("/api/wishlists/:wishlistId/invites/*", requireAuth);

app.route("/api/wishlists", wishlists);
app.route("/api/wishlists/:wishlistId/items", items);
app.route("/api/wishlists/:wishlistId/collaborators", collaborators);
app.route("/api/wishlists/:wishlistId/invites", invites);
app.route("/api/invites", publicInvites);

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.notFound((c) => {
  return c.json({ error: "Not Found", path: c.req.url }, 404);
});

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
});

const port = Number(process.env.PORT) || 3000;
console.log(`🚀 Wishlist API running on port ${port}`);

export default { port, fetch: app.fetch };
