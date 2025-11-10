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
  const devices = await prisma.devices.findMany();
  return c.json({ devices });
});

/**
 * Get device by ID
 */
devices.get("/:id", async (c) => {
  const id = c.req.param("id");
  const device = await prisma.devices.findFirst({
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

  const device = await prisma.devices.findFirst({
    where: {
      id: id,
    },
  });

  const req = await fetch(device?.address + "/api/v1/state", {
    method: "POST",
    body: JSON.stringify({
      power: body.power,
      brightness: body.brightness,
      color: body.color,
    }),
  });
  const res = await req.json();

  const updatedDevice = await prisma.devices.update({
    where: { id: id },
    data: {
      preferences: res.currentState,
    },
  });

  return c.json({ device: updatedDevice });
});

/**
 * Delete a device
 */
devices.delete("/:id", async (c) => {
  const id = c.req.param("id");

  await prisma.devices.delete({
    where: {
      id: id,
    },
  });

  return c.json({ message: "Device deleted successfully" });
});

export default devices;
