import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { runDiscovery } from "./active-discovery.js";
import discover from "./routes/discover.js";
import auth from "./routes/auth.js";
import devices from "./routes/devices.js";

const app = new Hono();

app.route("/api/v1/auth", auth);
app.route("/api/v1/discover", discover);
app.route("/api/v1/devices", devices);

// todo ai

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Gateway server running on port : ${info.port}`);
  }
);

setInterval(async () => {
  await runDiscovery();
}, 1000);

export default app;
