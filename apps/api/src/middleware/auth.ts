import type { Context, Next } from "hono";
import { auth } from "../auth";

type Session = typeof auth.$Infer.Session;

export type AuthVariables = {
  session: Session;
};

export const requireAuth = async (
  c: Context<{ Variables: AuthVariables }>,
  next: Next,
) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("session", session);
  await next();
};
