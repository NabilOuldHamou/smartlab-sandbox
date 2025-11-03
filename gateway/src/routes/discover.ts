import { prisma } from "../prisma-client.js";
import { Hono } from "hono";

const discover = new Hono();

discover.post("/", async (c) => {
  const body = await c.req.json();

  if (!body.id || !body.type) {
    return c.json({ error: "id and type are required" }, 400);
  }

  await prisma.appliance
    .create({
      data: {
        address: body.address,
        deviceId: body.id,
        type: body.type,
        capabilities: body.capabilities,
        preferences: body.defaultPreferences,
      },
    })
    .catch(() => {
      return c.json({ error: "Wrong format." }, 400);
    });

  return c.json({ message: "Device successfully registered" }, 200);
});

export default discover;
