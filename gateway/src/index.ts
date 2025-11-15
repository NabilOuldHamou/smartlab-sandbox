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

const app = new Hono();

app.use(cors());

app.route("/api/v1/auth", auth);
app.route("/api/v1/discover", discover);
app.route("/api/v1/devices", devices);

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
}, 1000);

export default app;
