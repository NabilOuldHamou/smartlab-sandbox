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

/**
 * Get all devices
 */
devices.get("/", async (c) => {
  const devices = await prisma.appliance.findMany();
  return c.json({ devices });
});

/**
 * Get device by ID
 */
devices.get("/:id", async (c) => {
  const id = c.req.param("id");

  const device = await prisma.appliance.findFirst({
    where: {
      id: id,
    },
  });

  return c.json({ device });
});

/**
 * Set action to device
 */
devices.post("/:id/action", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const device = await prisma.appliance.update({
    where: { id: id },
    data: {
      preferences: {
        state: body.state,
        colour: body.colour,
        brightness: body.brightness,
      },
    },
  });

  return c.json({ device });
});

/**
 * Delete a device
 */
devices.delete("/:id", async (c) => {
  const id = c.req.param("id");

  await prisma.appliance.delete({
    where: {
      id: id,
    },
  });

  return c.json({ message: "Device delete successfully" });
});

export default devices;
