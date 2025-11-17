import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { runDiscovery } from "./active-discovery.js";
import discover from "./routes/discover.js";
import auth from "./routes/auth.js";
import devices from "./routes/devices.js";
import { cors } from "hono/cors";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { logger } from "./logger.js";
import rules from "./routes/rules.js";
import { prisma } from "./prisma-client.js";

const app = new Hono();

app.use(cors());

app.route("/api/v1/auth", auth);
app.route("/api/v1/discover", discover);
app.route("/api/v1/devices", devices);
app.route("/api/v1/rules", rules);

const server = serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    logger.info(`Gateway server running on port : ${info.port}`);
  }
);

export const ioServer = new Server(server as HttpServer, {
  serveClient: false,
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

ioServer.on("connection", (socket) => {
  logger.info(`Client connected: ${socket.id}`);
});

setInterval(async () => {
  await runDiscovery();
}, 2000);

setInterval(async () => {
  const devices = await prisma.devices.findMany();
  for (const device of devices) {
    const timeSinceLastSeen = Date.now() - device.lastSeen.getTime();

    if (timeSinceLastSeen > 60000) {
      logger.error(`Deleting offline device ${device.id} from database.`);
      await prisma.devices.delete({
        where: { id: device.id },
      });
    } else if (timeSinceLastSeen > 30000) {
      logger.warn(
        `Device ${device.id} is offline. Device will be deleted in 30 seconds if not seen again.`
      );
    }
  }

  const existingDeviceIds = devices.map((d: any) => d.id);
  const allRules = await prisma.rules.findMany();

  for (const rule of allRules) {
    const whenData = rule.when as any;
    const thenData = rule.then as any;

    const sensorExists = existingDeviceIds.includes(whenData.sensorId);
    const actorExists = existingDeviceIds.includes(thenData.params.actorId);

    if (!sensorExists || !actorExists) {
      logger.info(`Deleting rule ${rule.id} because device no longer exists.`);
      await prisma.rules.delete({
        where: { id: rule.id },
      });
    }
  }
}, 30000);

export default app;
