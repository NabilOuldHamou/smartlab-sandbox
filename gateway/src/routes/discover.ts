import { prisma } from "../prisma-client.js";
import { Hono } from "hono";

const SUPPORTED_DEVICE_TYPES = ['light_bulb', 'motion_sensor', 'thermometer'] as const;

const discover = new Hono();

discover.post("/", async (c) => {
  const body = await c.req.json();

  if (!body.address || !body.type) {
    return c.json({ error: "address and type are required" }, 400);
  }

  if (!SUPPORTED_DEVICE_TYPES.includes(body.type)) {
    return c.json({ error: "Device type not supported." }, 400);
  }

  try {
    const device = await prisma.devices.create({
      data: {
        address: body.address,
        type: body.type,
        capabilities: body.capabilities,
        preferences: body.preferences,
      },
    });

    return c.json({ device }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ error }, 500);
  }
});

export default discover;
