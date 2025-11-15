import { Hono } from "hono";
import { prisma } from "../prisma-client.js";
import "dotenv/config";
import { verifyToken } from "../middleware.js";
import { evaluateRule } from "../rules-engine.js";
import { ioServer } from "../index.js";
import { logger } from "../logger.js";

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

  await evaluateRule(body.event);

  await prisma.devices.update({
    where: { id: id },
    data: {
      preferences: body.state,
    },
  });

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

export default devices;
