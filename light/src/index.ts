import { serve } from "@hono/node-server";
import { Hono } from "hono";
import state from "./routes/state.js";
import { searchForGateways } from "./active-search.js";

const app = new Hono();

app.route("/api/v1/state", state);
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
