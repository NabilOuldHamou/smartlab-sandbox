import { sign } from "hono/jwt";
import { prisma } from "../prisma-client.js";
import { Hono } from "hono";
import { logger } from "../logger.js";

const SUPPORTED_DEVICE_TYPES = [
  "light_bulb",
  "motion_sensor",
  "thermometer",
] as const;

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

    const payload = {
      id: device.id,
      exp: Math.floor(Date.now() / 1000) + 3600 * 24, // Token expires in 24 hours
    };
    const token = await sign(payload, process.env.JWT_SECRET!);

    return c.json(
      {
        token,
        device,
        routes: {
          events: `${process.env.GATEWAY_ADDRESS!}/api/v1/devices/${
            device.id
          }/event`,
          heartbeat: `${process.env.GATEWAY_ADDRESS!}/api/v1/devices/${
            device.id
          }/heartbeat`,
        },
      },
      200
    );
  } catch (error) {
    logger.error(error);
    return c.json({ error }, 500);
  }
});

export default discover;
