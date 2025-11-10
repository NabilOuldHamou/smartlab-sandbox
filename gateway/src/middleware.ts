import type { Context } from "hono";
import { verify } from "hono/jwt";
import "dotenv/config";

export const verifyToken = async (c: Context, next: () => Promise<void>) => {
  const authorization = c.req.header("Authorization");
  const token = authorization?.split(" ")[1];
  if (!token) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }

  try {
    await verify(token, process.env.JWT_SECRET!);
  } catch (e) {
    c.status(401);
    return c.json({ error: "Invalid token" });
  }

  await next();
};
