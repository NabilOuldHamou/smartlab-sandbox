import { serve } from "@hono/node-server";
import { Hono } from "hono";
import motion from "./routes/motion.js";
import { searchForGateways } from "./active-search.js";

const app = new Hono();

app.route("/api/v1/motion", motion);
serve(
  {
    fetch: app.fetch,
    port: 3003,
  },
  (info) => {
    console.log(`Motion server running on port : ${info.port}`);
  }
);

// RUN DISCOVERY ON STARTUP
await searchForGateways();

export default app;
