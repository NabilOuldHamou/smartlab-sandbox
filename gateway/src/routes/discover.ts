import { getConnInfo } from "@hono/node-server/conninfo";
import { prisma } from "../prisma-client.js";
import { Hono } from "hono";

const discover = new Hono();

/**
 * MIDDLEWARE CHECKS FOR JWT TOKEN VALIDITY
 */
discover.use(async (c, next) => {
  const authorization = c.req.header("authorization");
  console.log(authorization);
  if (!authorization) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }

  await next();
});

discover.get("/", async (c) => {
  const devices = await prisma.appliance.findMany();
  return c.json({ devices });
});

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
