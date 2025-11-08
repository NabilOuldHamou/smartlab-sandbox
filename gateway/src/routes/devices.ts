import { Hono } from "hono";
import { prisma } from "../prisma-client.js";
import { verify } from "hono/jwt";
import "dotenv/config";
import { verifyToken } from "../middleware.js";

const devices = new Hono();

/**
 * MIDDLEWARE CHECKS FOR JWT TOKEN VALIDITY
 */
devices.use(verifyToken);

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

  return c.json({ message: "Device deleted successfully" });
});

export default devices;
