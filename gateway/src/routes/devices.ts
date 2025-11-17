import { Hono } from "hono";
import { prisma } from "../prisma-client.js";
import "dotenv/config";
import { verifyToken } from "../middleware.js";
import { evaluateRule } from "../rules-engine.js";
import { ioServer } from "../index.js";
import { logger } from "../logger.js";
import { sign } from "hono/jwt";

const devices = new Hono();

let overrideTimestamp = 0;

/**
 * MIDDLEWARE CHECKS FOR JWT TOKEN VALIDITY
 */
devices.use(verifyToken);

/**
 * Get all devices
 */
devices.get("/", async (c) => {
  const devices = await prisma.devices.findMany({
    orderBy: {
      name: "asc",
    },
  });
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

  overrideTimestamp = Date.now();

  const device = await prisma.devices.findFirst({
    where: {
      id: id,
    },
  });

  const req = await fetch(device?.address + "/api/v1/state", {
    method: "POST",
    body: JSON.stringify(body),
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

devices.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const updatedDevice = await prisma.devices.update({
    where: { id: id },
    data: {
      name: body.name,
    },
  });

  return c.json({ device: updatedDevice });
});

/**
 * Receive event from device
 */
devices.post("/:id/event", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const payload_id = (c as any).get("payload_id");
  if (payload_id !== id) {
    logger.warn(
      `Payload ID ${payload_id} does not match device ID ${id}, potential tampering detected.`
    );
    return c.json({ message: "Unauthorized" }, 401);
  }

  await prisma.devices.update({
    where: { id: id },
    data: {
      preferences: body.state,
    },
  });

  if (Date.now() - overrideTimestamp < 30000) {
    logger.info(
      `Skipping rule evaluation for device ${id} due to recent manual override.`
    );
  } else {
    await evaluateRule(body.event);
  }

  ioServer.emit("device-event", {
    deviceId: id,
    event: body.event,
    state: body.state,
    timestamp: new Date().toISOString(),
  });

  return c.json({ message: "Event received" }, 200);
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

/**
 * Device heartbeat - returns a new JWT token
 */
devices.post("/:id/heartbeat", async (c) => {
  const id = c.req.param("id");

  const device = await prisma.devices.findFirst({
    where: {
      id: id,
    },
  });

  if (!device) {
    return c.json({ error: "Device not found" }, 404);
  }

  logger.info(`Received heartbeat from device ${id}`);

  const payload = {
    id: device.id,
    exp: Math.floor(Date.now() / 1000) + 3600 * 24, // Token expires in 24 hours
  };

  await prisma.devices.update({
    where: { id: id },
    data: {
      lastSeen: new Date(),
    },
  });

  const token = await sign(payload, process.env.JWT_SECRET!);
  return c.json({ token });
});

export default devices;
