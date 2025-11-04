import { serve } from "@hono/node-server";
import { Hono } from "hono";
import telemetry from "./routes/telemetry.js";
import { searchForGateways } from "./active-search.js";

const app = new Hono();

app.route("/api/v1/telemetry", telemetry);
serve(
  {
    fetch: app.fetch,
    port: 3002,
  },
  (info) => {
    console.log(`Light server running on port : ${info.port}`);
  }
);

// RUN DISCOVERY ON STARTUP
await searchForGateways();

export default app;
