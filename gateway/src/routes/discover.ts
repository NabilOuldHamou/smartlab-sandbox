import { getConnInfo } from "@hono/node-server/conninfo";
import { prisma } from "../prisma-client.js";
import { Hono } from "hono";

const discover = new Hono();

discover.post("/", async (c) => {
  const body = await c.req.json();
  const info = getConnInfo(c);
  const address = `${info.remote.address}:${info.remote.port}` || "undefined";

  if (!body.id || !body.type) {
    return c.json({ error: "id and type are required" }, 400);
  }

  await prisma.appliance
    .create({
      data: {
        address,
        deviceId: body.id,
        type: body.type,
        capabilities: body.capabilities,
        preferences: {},
      },
    })
    .catch(() => {
      return c.json({ error: "An error occurred." }, 500);
    });

  return c.json({ message: "Device successfully registered" }, 200);
});

export default discover;
