import { Hono } from "hono";
import { prisma } from "../prisma-client.js";
import { verify } from "hono/jwt";
import "dotenv/config";

const devices = new Hono();

/**
 * MIDDLEWARE CHECKS FOR JWT TOKEN VALIDITY
 */
devices.use(async (c, next) => {
  const authorization = c.req.header("Authorization");
  if (!authorization) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }

  try {
    await verify(authorization, process.env.JWT_SECRET!);
  } catch (e) {
    c.status(401);
    return c.json({ error: "Invalid token" });
  }

  await next();
});

devices.get("/", async (c) => {
  const devices = await prisma.appliance.findMany();
  return c.json({ devices });
});

export default devices;
